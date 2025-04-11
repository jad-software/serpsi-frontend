import { formatHour } from "@/services/utils/formatDate";
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
import { updateMeetingStatus } from "@/services/meetingsService";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue
} from "@/components/ui/select";

const sessionSchema = z.object({
	paymentMethod: z.string().min(1, "Forma de pagamento é obrigatória."),
	sessionValue: z
		.string()
		.regex(
			/^R\$ (\d{1,3}(\.\d{3})*|\d+),\d{2}$/,
			"O valor da sessão deve ser um valor monetário válido."
		)
		.refine(
			(value) => {
				const numericValue =
					parseFloat(value.replace(/[^\d]/g, "")) / 100;
				return numericValue > 0;
			},
			{
				message: "O valor da sessão deve ser maior que R$ 0,00."
			}
		),
	startDate: z.string().refine(
		(value) => {
			const [year, month, day] = value.split("-").map(Number);
			const inputDate = new Date(year, month - 1, day);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return inputDate >= today;
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
	status: "CANCELADO" | "CONFIRMADO" | "CREDITO" | string;
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
		} catch (error) { }
	};

	const cancelSession = () => {
		try {
			toast.promise(updateMeetingStatus(id, "CANCELADO"), {
				loading: "Cancelando sessão...",
				success: "Sessão cancelada com sucesso!",
				error: "Houve um erro ao cancelar sessão."
			});
			setSessionStatus("CANCELADO");
		} catch (error) { }
	};

	const router = useRouter();

	const methods = useForm<SessionData>({
		resolver: zodResolver(sessionSchema),
		defaultValues: {
			startDate: "",
			startTime: ""
		}
	});

	const { register, handleSubmit, control, formState, setValue } = methods;
	const { errors } = formState;

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

	return (
		<div
			className="mb-2 flex h-16 w-full cursor-pointer justify-between rounded-xl border border-primary-600 bg-white px-4 md:px-8 hover:bg-primary-50"
		// onClick={() => router.push(`/sessions/${id}`)}
		>
			<div className="flex w-full">
				<UserIcon width={28} />
				<div className="ml-2 flex flex-col items-start justify-center">
					<h2 className="sm:text-xl">{name}</h2>
					{/* <span className="text-xs">Pag: {}</span> */}
				</div>
			</div>
			<div className="flex items-center justify-center md:pr-8 ">
				{getStatusIcon()}
				<span className="ml-1 text-lg">{formatHour(schedule)}</span>
			</div>

			<Dialog>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger className="rounded-full px-2">
						<DotsVerticalIcon width={20} />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
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
							{...{ disabled: sessionStatus === "CANCELADO" }}
						>
							<CheckIcon width={16} height={16} />
							&nbsp; Confirmar
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={cancelSession}
							{...{ disabled: sessionStatus === "CANCELADO" }}
						>
							<XIcon width={16} height={16} />
							&nbsp; Cancelar
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<DialogContent className="w-full max-w-[50vw]">
					<FormProvider {...methods}>
						<form
							onSubmit={handleSubmit((data) => {
								console.log(data);
							})}
						>
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
										className={`h-11 w-full rounded border ${errors.startDate
												? "border-red-500"
												: "border-primary-400"
											} 
											p-2`
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
										Horário da sessão:
									</label>
									<Controller
										name="startTime"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger className="h-11 w-full border-primary-400">
													<SelectValue placeholder="Selecione o horário" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="08:00">
														08:00
													</SelectItem>
													<SelectItem value="09:00">
														09:00
													</SelectItem>
													<SelectItem value="10:00">
														10:00
													</SelectItem>
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
							</div>
							<div className="mt-4 flex justify-center">
								<DialogClose asChild>
									<Button
										type="submit"
										className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600/70"
									>
										Confirmar
									</Button>
								</DialogClose>
							</div>
						</form>
					</FormProvider>
				</DialogContent>
			</Dialog>
		</div>
	);
}
