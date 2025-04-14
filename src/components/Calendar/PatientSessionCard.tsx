import { formatDateToddmmYYYYHHMM, formatDateToYYYYmmdd, formatHour } from "@/services/utils/formatDate";
import {
	CheckCircleIcon,
	CheckIcon,
	ClockIcon,
	DotsVerticalIcon,
	ExclamationCircleIcon,
	PencilAltIcon,
	UserIcon,
	XCircleIcon,
	XIcon
} from "@heroicons/react/outline";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {
	getHourAvailableByDate,
	updateMeeting,
	updateMeetingStatus
} from "@/services/meetingsService";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose,
	DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue
} from "@/components/ui/select";
import { getProfileData } from "@/services/profileService";

const sessionSchema = z.object({
	sessionValue: z
		.string()
		.min(1, "O valor da sessão é obrigatório")
		.refine(
			(value) => {
				const numericValue =
					parseFloat(value.replace(/[^\d]/g, "")) / 100;
				return numericValue > 0;
			},
			{
				message: "O valor da sessão deve ser maior que R$ 0"
			}
		),
	startDate: z
		.string()
		.min(1, "A data da primeira sessão é obrigatória.")
		.refine(
			(value) => {
				const [year, month, day] = value.split("-").map(Number);
				const inputDate = new Date(year, month - 1, day);
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				return inputDate.getTime() >= today.getTime();
			},
			{
				message: "A data não pode estar no passado."
			}
		),
	startTime: z.string().min(1, "O horário da sessão é obrigatório.")
});

type SessionData = z.infer<typeof sessionSchema>;

interface PatientSessionCardProps {
	id: string;
	name: string;
	// paymentPlan: string;
	status: "CANCELADO" | "CONFIRMADO" | "CREDITO" | "ABERTO";
	schedule: string;
}

export default function PatientSessionCard({
	id,
	name,
	//paymentPlan,
	status,
	schedule
}: PatientSessionCardProps) {
	const [sessionStatus, setSessionStatus] = useState(status);
	const [aVTime, setAvTime] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	let sessionValue = useRef("R$ 0,00");

	const getStatusIcon = () => {
		if (sessionStatus === "CONFIRMADO") {
			return <CheckCircleIcon width={24} color="#2E7D32" />;
		} else if (sessionStatus === "CANCELADO") {
			return <XCircleIcon width={24} color="#E64A19" />;
		} else if (sessionStatus === "CREDITO") {
			return <ExclamationCircleIcon width={24} color="#FFC107" />;
		}

		return <ClockIcon width={24} />;
	};

	const confirmSession = () => {
		try {
			toast.promise(updateMeetingStatus(id, "CONFIRMADO"), {
				loading: "Confirmando sessão...",
				success: "Sessão confirmada com sucesso!",
				error: "Houve um erro ao confirmar sessão."
			});
			setSessionStatus("CONFIRMADO");
		} catch (error) {}
	};

	const cancelSession = () => {
		try {
			toast.promise(updateMeetingStatus(id, "CANCELADO"), {
				loading: "Cancelando sessão...",
				success: "Sessão cancelada com sucesso!",
				error: "Houve um erro ao cancelar sessão."
			});
			setSessionStatus("CANCELADO");
		} catch (error) {}
	};

	const router = useRouter();

	const methods = useForm<SessionData>({
		resolver: zodResolver(sessionSchema),
		defaultValues: {
			startDate: schedule.split("T")[0],
			startTime: schedule.split("T")[1],
			sessionValue: "R$ 0,00"
		}
	});

	const { register, handleSubmit, control, formState, setValue } = methods;
	const { errors } = formState;

	useEffect(() => {
		async function getProfile() {
			const value = await getProfileData();
			const numericValue = parseFloat(value._meetValue);
			const formattedValue = numericValue.toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL"
			});

			sessionValue.current = formattedValue;
			setValue("sessionValue", formattedValue, { shouldValidate: true });
		}
		getProfile();
	}, [setValue]);

	const formatToCurrency = (value: string) => {
		if (!value) return "R$ 0,00";
		const numericValue = value.replace(/[^\d]/g, "");
		const num = parseFloat(numericValue) / 100;
		return `R$ ${num.toFixed(2).replace(".", ",")}`;
	};

	const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/[^\d]/g, "");
		const formattedValue = formatToCurrency(rawValue);
		setValue("sessionValue", formattedValue, { shouldValidate: true });
	};

	const startDate = methods.watch("startDate");

	const handleStartDateBlur = async (startDateformated: string) => {
		if (!errors.startDate) {
			try {
				setValue("startTime", "");
				const data: {
					day: string;
					avaliableTimes: string[];
				} = await getHourAvailableByDate(startDateformated);
				const allTimes = data.avaliableTimes;
				setAvTime(allTimes);
			} catch (error) {
				console.error("Erro ao buscar dados:", error);
			}
		}
	};

	const onSubmit = async (data: SessionData) => {
		try {
			let timeOffset = new Date().getTimezoneOffset() / 60;
			let offset =
				(Math.abs(timeOffset) < 10
					? "0" + timeOffset
					: timeOffset.toString()) + ":00";
			offset = timeOffset < 0 ? "+" + offset : "-" + offset;
			const { startDate, startTime, sessionValue } = data;
			const schedule = `${startDate}T${startTime}${offset}`;
			const amount = sessionValue
				.replace(/R\$\s?/, "")
				.replace(".", "")
				.replace(",", ".");
			toast.promise(updateMeeting(id, schedule, +amount), {
				loading: "Atualizando sessão...",
				success: () => {
					setIsOpen(false);
					location.reload();
					return "Sessão atualizada com sucesso!";
				},
				error: () => {
					return "Houve um erro ao atualizar sessão.";
				}
			});
		} catch (error) {}
	};

	return (
		<div className="mb-2 flex h-16 w-full cursor-pointer justify-between rounded-xl border border-primary-600 bg-white px-4 hover:bg-primary-50 md:px-8">
			<div
				className="flex w-full items-center justify-between"
				onClick={(e) => {
					if (isOpen) return;

					const target = e.target as HTMLElement;
					const isThreeDots = target.closest(
						"[data-dropdown-trigger]"
					);

					if (!isThreeDots) {
						router.push(`/home/sessions/${id}?name=${formatDateToddmmYYYYHHMM(new Date(schedule))}`);
					}
				}}
			>
				<div className="flex w-full">
					<UserIcon width={28} />
					<div className="ml-2 flex flex-col items-start justify-center">
						<h2 className="sm:text-xl">{name}</h2>
						{/* <span className="text-xs">Pag: {}</span> */}
					</div>
				</div>
				<div className="flex items-center justify-center md:pr-8">
					{getStatusIcon()}
					<span className="ml-1 text-lg">{formatHour(schedule)}</span>
				</div>
			</div>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger
						className="rounded-full px-2"
						data-dropdown-trigger
					>
						<DotsVerticalIcon width={20} />
					</DropdownMenuTrigger>
					<DropdownMenuContent data-dropdown-trigger>
						<DialogTrigger asChild>
							<DropdownMenuItem
								className="cursor-pointer"
								{...{ disabled: sessionStatus === "CANCELADO" }}
							>
								<PencilAltIcon width={16} height={16} />
								&nbsp;Editar Sessão
							</DropdownMenuItem>
						</DialogTrigger>

						<DropdownMenuItem
							className="cursor-pointer"
							onClick={confirmSession}
							{...{
								disabled:
									sessionStatus === "CANCELADO" ||
									sessionStatus === "CREDITO" ||
									sessionStatus === "CONFIRMADO"
							}}
						>
							<CheckIcon width={16} height={16} />
							&nbsp; Confirmar
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={cancelSession}
							{...{
								disabled:
									sessionStatus === "CANCELADO" ||
									sessionStatus === "CREDITO"
							}}
						>
							<XIcon width={16} height={16} />
							&nbsp; Cancelar
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<DialogContent className="w-full max-w-[80dvw] md:max-w-[50vw]">
					<FormProvider {...methods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<DialogHeader>
								<DialogTitle className="text-xl font-semibold text-primary-700">
									Editar sessão
								</DialogTitle>
								<DialogDescription className="text-sm text-gray-500">
									Preencha os dados para editar a sessão.
								</DialogDescription>
							</DialogHeader>
							<div className="mt-4 grid grid-cols-1 gap-4">
								{/* Data da sessão */}
								<div>
									<label className="mb-2 block font-medium text-gray-700">
										Data da sessão:
									</label>
									<input
										type="date"
										{...register("startDate")}
										className={`h-11 w-full rounded border ${
											errors.startDate
												? "border-red-500"
												: "border-primary-400"
										} p-2`}
										onBlur={() =>
											handleStartDateBlur(
												formatDateToYYYYmmdd(
													new Date(startDate)
												)
											)
										}
									/>
									{errors.startDate && (
										<p className="text-sm text-red-500">
											{errors.startDate.message}
										</p>
									)}
								</div>

								{/* Horário da sessão */}
								<div>
									<label className="mb-2 block font-medium text-gray-700">
										Horário da primeira sessão:
									</label>
									<Controller
										name="startTime"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger
													className={
														errors.startTime
															? "h-11 w-full border-red-500 focus:ring-red-600"
															: "h-11 w-full border-primary-400 focus:ring-primary-500"
													}
												>
													<SelectValue placeholder="Selecione o horário..." />
												</SelectTrigger>
												<SelectContent>
													{aVTime?.length > 0 ? (
														aVTime.map(
															(av, index) => {
																return (
																	<SelectItem
																		key={
																			index
																		}
																		value={
																			av
																		}
																	>{`${av.split(":")[0]}:${av.split(":")[1]}`}</SelectItem>
																);
															}
														)
													) : (
														<p>
															Nenhum horário
															disponível para esse
															dia
														</p>
													)}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.startTime && (
										<p className="text-sm text-red-500">
											{errors.startTime.message}
										</p>
									)}
								</div>

								{/* Valor da sessão */}
								<div>
									<label className="mb-2 block font-medium text-gray-700">
										Valor da sessão:
									</label>
									<input
										type="text"
										{...register("sessionValue")}
										onChange={handleCurrencyChange}
										placeholder="R$ 0,00"
										className={`h-11 w-full rounded border ${
											errors.sessionValue
												? "border-red-500"
												: "border-primary-400"
										} p-2 focus:ring`}
									/>
									{errors.sessionValue && (
										<p className="text-sm text-red-500">
											{errors.sessionValue.message}
										</p>
									)}
								</div>
							</div>
							<div className="mt-4 flex justify-center">
								<DialogFooter>
									<Button
										type="submit"
										className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600/70"
									>
										Confirmar
									</Button>
								</DialogFooter>
							</div>
						</form>
					</FormProvider>
				</DialogContent>
			</Dialog>
		</div>
	);
}
