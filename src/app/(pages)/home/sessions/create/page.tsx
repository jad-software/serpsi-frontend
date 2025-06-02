"use client";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import CriarSessao from "./criar-sessao.svg";
import psiImage from "/public/img/avatar.svg";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import InputMask from "react-input-mask-next";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { getData } from "@/services/myPatientService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Patient, Phone } from "@/models";
import {
	formatDateToddmmYYYY,
	formatDateToYYYYmmdd
} from "@/services/utils/formatDate";
import {
	createMeeting,
	getHourAvailableByDate
} from "@/services/meetingsService";
import { toast } from "sonner";
import { formatToCurrency } from "@/services/utils/formatCurrency";
import { formatPhone } from "@/services/utils/formatPhone";
import { getProfileData } from "@/services/profileService";
import Loading from "@/components/loading/Loading";
import { useRouter } from "next/navigation";

const sessionSchema = z.object({
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
	frequency: z.string().min(1, "A frequência da Sessão é obrigatória"),
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
	startTime: z.string().min(1, "O horário da sessão é obrigatório."),
	sessionCount: z
		.number()
		.positive("O número de sessões deve ser maior que zero."),
	paymentMethod: z.string().optional()
});

type SessionData = z.infer<typeof sessionSchema>;

export default function CreateSession() {
	const searchParams = useSearchParams();
	const [data, setData] = useState({} as Patient);
	const [aVTime, setAvTime] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [isDataLoading, setIsDataLoading] = useState(true);
	const router = useRouter();
	let sessionValue = useRef("R$ 0,00");
	const id = searchParams.get("id");

	const methods = useForm<SessionData>({
		resolver: zodResolver(sessionSchema),
		defaultValues: {
			startDate: "",
			frequency: "",
			sessionValue: sessionValue.current,
			startTime: "",
			sessionCount: 1,
			paymentMethod: ""
		},
		mode: "onChange"
	});

	const { register, handleSubmit, formState, control, setValue, watch } =
		methods;
	const { errors } = formState;

	useEffect(() => {
		async function fetchData() {
			if (id) {
				const data = await getData(id);
				setData(data as unknown as Patient);
				setIsDataLoading(false);
			}
		}
		fetchData();
	}, [id]);

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

	const startDate = watch("startDate");

	const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/[^\d]/g, "");
		const formattedValue = formatToCurrency(rawValue);
		setValue("sessionValue", formattedValue, { shouldValidate: true });
	};

	const onSubmit = async (data: SessionData) => {
		setLoading(true);
		const toastId = toast.loading("Carregando...");
		let timeOffset = new Date().getTimezoneOffset() / 60;
		let offset =
			(Math.abs(timeOffset) < 10
				? "0" + timeOffset
				: timeOffset.toString()) + ":00";
		offset = timeOffset < 0 ? "+" + offset : "-" + offset;
		const { startDate, startTime, frequency, sessionValue, sessionCount } =
			data;
		const schedule = `${startDate}T${startTime}${offset}`;
		const meetingFrequency = +frequency;
		const amount = sessionValue
			.replace(/R\$\s?/, "")
			.replace(".", "")
			.replace(",", ".");
		try {
			const result = await createMeeting({
				amount: +amount,
				frequency: meetingFrequency,
				patient: id || "",
				psychologist: "",
				quantity: sessionCount,
				schedule: schedule
			});
			setLoading(false);
			toast.dismiss(toastId);

			if (result.conflicts && result.conflicts.length > 0) {
				toast.warning("Sessões criadas com conflitos", {
					description: "verifique no calendário"
				});
			} else {
				toast.success("Sessões criadas com sucesso");
			}

			router.push("/home");
		} catch (error) {
			toast.dismiss(toastId);
			setLoading(false);
			toast.error(
				"Erro ao criar sessão, certifique se todos os horários estão livres"
			);
		}
	};

	return (
		<main className="flex flex-col items-center justify-center bg-white px-4 py-5 lg:px-10">
			{isDataLoading ? (
				<Loading />
			) : (
				<>
					<div className="mb-4 w-full">
						<Link
							href={"/home/sessions"}
							className="flex items-center text-gray-500"
						>
							<ChevronLeftIcon className="h-6 w-6" />
							<span className="ml-2 text-lg">
								Agendar Sessões
							</span>
						</Link>
					</div>

					<section className="w-fullmax-w-screen-lg rounded-lg border border-primary-400 p-5 lg:flex lg:space-x-10">
						<div className="flex-1">
							<h1 className="mb-6 text-lg font-semibold text-primary-700">
								Informações do paciente:
							</h1>
							<div className="mb-6 flex flex-col items-center justify-center md:flex-row md:items-start md:space-x-10">
								<div className="mb-2 flex flex-col items-center space-x-4 md:mb-0 md:flex-row md:items-start">
									<Image
										src={
											data._person
												? data._person._profilePicture
												: psiImage
										}
										alt="Profile"
										width={100}
										height={100}
										className="h-24 w-24 rounded-full object-cover"
										unoptimized={true}
									/>
									<div>
										<p>
											Nome:{" "}
											{data._person && data._person._name}
										</p>
										<p>
											Nascimento:{" "}
											{data._person &&
												formatDateToddmmYYYY(
													data._person._birthdate
												)}
										</p>
										<p>
											CPF:{" "}
											{data._person &&
												data._person._cpf._cpf}
										</p>
										<p>
											Tel:{" "}
											{data._person &&
												formatPhone(
													data._person._phone,
													false
												)}
										</p>
									</div>
								</div>

								<div className="flex max-w-96 flex-col gap-2 overflow-x-auto px-12 md:flex-row">
									{data._parents &&
										data._parents.map((p, index) => (
											<div key={p._id._id}>
												<p>
													Responsável {index + 1}:{" "}
													{p._name}
												</p>
												<p>
													Nascimento:{" "}
													{formatDateToddmmYYYY(
														p._birthdate
													)}
												</p>
												<p>CPF: {p._cpf._cpf}</p>
												<p>
													Tel:{" "}
													{formatPhone(
														p._phone,
														false
													)}
												</p>
											</div>
										))}
								</div>
							</div>

							<h2 className="mb-4 text-lg font-semibold text-primary-700">
								Criar próximas sessões:
							</h2>
							<FormProvider {...methods}>
								<form
									onSubmit={handleSubmit(onSubmit)}
									className="grid grid-cols-1 gap-6 md:grid-cols-2"
								>
									<div>
										<label className="mb-2 block font-medium text-gray-700">
											Data da primeira sessão:
										</label>
										<input
											type="date"
											{...register("startDate")}
											onBlur={() =>
												handleStartDateBlur(
													formatDateToYYYYmmdd(
														new Date(startDate)
													)
												)
											}
											className={`h-11 w-full rounded border ${errors.startDate ? "border-red-500" : "border-primary-400"} p-2 focus:ring`}
										/>
										{errors.startDate && (
											<p className="text-sm text-red-500">
												{errors.startDate.message}
											</p>
										)}

										<label className="mb-2 mt-4 block font-medium text-gray-700">
											Frequência das sessões:
										</label>

										<Controller
											name="frequency"
											control={control}
											render={({ field }) => (
												<Select
													onValueChange={
														field.onChange
													}
													value={field.value}
												>
													<SelectTrigger
														className={
															errors.frequency
																? "h-11 w-full border-red-500 focus:ring-red-600"
																: "h-11 w-full border-primary-400 focus:ring-primary-500"
														}
													>
														<SelectValue placeholder="Selecione a frequência das sessões..." />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="1">
															Semanal
														</SelectItem>
														<SelectItem value="2">
															Quinzenal
														</SelectItem>
														<SelectItem value="4">
															Mensal
														</SelectItem>
														<SelectItem value="0">
															Avulso
														</SelectItem>
													</SelectContent>
												</Select>
											)}
										/>
										{errors.frequency && (
											<p className="text-sm text-red-500">
												{errors.frequency.message}
											</p>
										)}

										<label className="mb-2 mt-4 block font-medium text-gray-700">
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

									<div>
										<label className="mb-2 block font-medium text-gray-700">
											Horário da primeira sessão:
										</label>
										<Controller
											name="startTime"
											control={control}
											render={({ field }) => (
												<Select
													onValueChange={
														field.onChange
													}
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
																disponível para
																esse dia
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

										<label className="mb-2 mt-4 block font-medium text-gray-700">
											Número de sessões:
										</label>
										<input
											type="number"
											{...register("sessionCount", {
												valueAsNumber: true
											})}
											placeholder="10"
											className={`h-11 w-full rounded border ${errors.sessionCount ? "border-red-500" : "border-primary-400"} p-2 focus:ring`}
										/>
										{errors.sessionCount && (
											<p className="text-sm text-red-500">
												{errors.sessionCount.message}
											</p>
										)}

										<label className="mb-2 mt-4 block font-medium text-gray-700">
											Forma de pagamento:
										</label>
										<Controller
											name="paymentMethod"
											control={control}
											render={({ field }) => (
												<Select
													onValueChange={
														field.onChange
													}
													value={field.value}
													disabled
												>
													<SelectTrigger className="h-11 w-full bg-gray-100 focus:ring">
														<SelectValue placeholder="A Definir" />
													</SelectTrigger>
												</Select>
											)}
										/>
									</div>

									<div className="flex w-full justify-center pb-10 md:col-span-2">
										<Button
											type="submit"
											disabled={loading}
											className="rounded bg-primary-600 px-8 py-2 text-white hover:bg-primary-600/70"
										>
											{loading
												? "Carregando"
												: "Confirmar"}
										</Button>
									</div>
								</form>
							</FormProvider>
						</div>

						<div className="hidden items-center lg:flex">
							<Image
								src={CriarSessao}
								alt="Imagem tela cadastro sessão"
								width={400}
								height={400}
								className="object-contain"
							/>
						</div>
					</section>
				</>
			)}
		</main>
	);
}
