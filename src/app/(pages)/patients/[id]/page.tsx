"use client"
import Image from "next/image";
import { Square, SquareHeader } from "./Square";
import { ChevronLeftIcon, DocumentSearchIcon, PencilAltIcon } from "@heroicons/react/outline";
import { ComorbidityTag } from "./comorbidityTag";
import Link from "next/link";
import { getData } from "@/services/myPatientService";
import { Comorbidity, MedicamentInfo, Patient, Person, Phone } from "@/models";
import { ListComponent } from "./listComponent";
import { formatDateToddmmYYYY } from "@/services/utils/formatDate";
import { formatPhone } from "@/services/utils/formatPhone";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { formatMedicineSchedule } from "@/services/utils/formatMedicine";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon } from "@radix-ui/react-icons";
import InputMask from "react-input-mask-next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { comorbidityData, MedicineData, ParentData, PatientData, PatientSchema, PersonData } from "./patientSchema";
import moment from "moment";

export default function MyPatient({
	params
}: {
	params: { id: string };
}) {
	const methods = useForm<PatientData>({
		resolver: zodResolver(PatientSchema),
		mode: "onChange"
	});
	const { register, handleSubmit, formState, control, watch } = methods;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "_comorbidities",
	});
	const { errors } = formState;

	const formatPhoneObject = (phone: any) => {
		if (typeof phone === "string") return phone; // Já está formatado
		if (phone?._ddi && phone?._ddd && phone?._number) {
			return `(${phone._ddd}) ${phone._number}`;
		}
		return "";
	};

	const parsePhoneString = (phoneString: string) => {
		const match = phoneString.match(/\((\d{2})\) (\d{5}-\d{4})/);
		if (match) {
			return { _ddi: "55", _ddd: match[1], _number: match[2] }; // Assumindo DDI = 55 (Brasil)
		}
		return phoneString;
	};

	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<PatientData>();
	const [image, setImage] = useState<string | null>(null);
	const hasRun = useRef(false)
	useEffect(() => {
		if (hasRun.current) return
		hasRun.current = true;

		async function fetchData(id: string) {
			const response = await getData(id);
			const formattedData: PatientData = {
				...response,

				_person: {
					...response._person,
					_birthdate:
						moment
							.utc(response._person._birthdate)
							.format("YYYY-MM-DD"),
					// _phone: formatPhone(response._person._phone as Phone)
				},

				_parents: response._parents.map((parent: ParentData) => ({
					...parent,
					_birthdate: moment
						.utc(parent._birthdate)
						.format("YYYY-MM-DD"),
					// _phones: formatPhone(parent._phone as Phone),
				})),
			}
			setData(formattedData);
			methods.reset(formattedData);
			console.log(formattedData)
		}
		fetchData(params.id);
	}, [params.id, methods]);

	const onSubmit: SubmitHandler<PatientData> = async (data) => {
		console.log(data);
	}

	return (
		<FormProvider {...methods}>
			<main className="flex flex-col items-center justify-center bg-cover px-10 py-5">
				{!data ? (
					<section className="fixed inset-0 z-50 flex items-center justify-center">
						<div className="h-5 w-5 animate-spin rounded-full border-t-4 border-primary-600"></div>
					</section>
				)
					:
					<>
						<div className="mb-2 flex w-full">
							<Link href={"/patients"} className="flex">
								<ChevronLeftIcon
									width={24}
									height={24}
									className="text-gray-500"
								/>
								&nbsp;
								<span className="text-gray-900">{data._person._name}</span>
							</Link>
						</div>
						<section className="w-[60vw]">
							{!isEditing && (
								<section
									className="flex cursor-pointer items-center justify-end space-x-3"
									onClick={() => {
										setImage(null);
										setIsEditing(!isEditing);
									}}
								>
									<span className="text-primary-600">
										Editar perfil
									</span>
									<PencilAltIcon
										className="text-primary-400"
										width={24}
										height={24}
									/>
								</section>
							)}
							<form onSubmit={methods.handleSubmit(onSubmit)}>
								<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">

									{/* Card do Perfil */}
									<Square variant="WithImage">
										{isEditing ? (
											<div className="mb-3 flex w-full flex-col items-center justify-center">
												<input
													type="file"
													id="foto-paciente"
													accept="image/jpeg, image/png"
													{...methods.register("picture")}
													className="hidden"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															const reader = new FileReader();
															reader.onload = (event) => {
																setImage(event.target?.result as string); // Atualiza a imagem no estado
															};
															reader.readAsDataURL(file);
														}
													}}
												/>
												<label htmlFor="foto-paciente" className="cursor-pointer">
													{image ? (
														<Image
															src={image}
															alt="Foto Do Paciente"
															className="h-36 w-36 rounded-full object-cover"
															width={140}
															height={140}
														/>
													) : (
														<div className="flex h-36 w-36 items-center justify-center rounded-full bg-gray-300 p-5">
															<UploadIcon width={75} height={75} />
														</div>
													)}
												</label>
											</div>
										) : (
											<Image
												className="mb-4 h-24 w-24 rounded-full"
												src={data._person._profilePicture ?? ""}
												width={100}
												height={100}
												alt="Foto de perfil do paciente"
											/>
										)}
										{isEditing ? (
											<div className="flex flex-col w-full items-start">
												<label className="block text-gray-700">Nome:</label>
												<input
													type="text"
													{...methods.register("_person._name")}
													className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
												/>
											</div>
										) : (
											<>
												<h2 className="text-xl text-gray-900">
													{methods.getValues("_person._name") || data._person._name}
												</h2>
												<div className="flex items-center gap-2">
													<a href="#" className="mt-2 text-sm text-primary-700 no-underline">
														Visualizar Documentos
													</a>
													<DocumentSearchIcon className="mt-2 h-6 w-6 text-sm text-primary-700 underline hover:cursor-pointer" />
												</div>
											</>
										)}
									</Square>

									{/* Informações do Paciente */}
									<Square>
										<SquareHeader titulo="Informações do paciente" />
										{isEditing ? (
											<>
												{/* Nascimento */}
												<div className="mb-2">
													<label className="block text-gray-700">Nascimento:</label>
													<input
														type="date"
														{...register("_person._birthdate")}
														defaultValue={new Date(methods.getValues(
															"_person._birthdate"
														)).toISOString().split('T')[0]}
														className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
													/>
													{errors._person?._birthdate && (
														<p className="text-sm text-red-500">
															{errors._person._birthdate.message}
														</p>
													)}
												</div>

												{/* CPF */}
												<div className="mb-2">
													<label className="block text-gray-700">CPF:</label>
													<input
														type="text"
														disabled
														{...register("_person._cpf._cpf")}
														className="w-full rounded-xl border border-primary-500 bg-gray-500 p-2 text-primary-800 focus:outline focus:outline-primary-800"
													/>
													{errors._person?._cpf?._cpf && (
														<p className="text-sm text-red-500">{errors._person._cpf.message}</p>
													)}
												</div>

												{/* RG */}
												<div className="mb-2">
													<label className="block text-gray-700">RG:</label>
													<input
														type="text"
														disabled
														{...register("_person._rg")}
														className="w-full rounded-xl border border-primary-500 bg-gray-500 p-2 text-primary-800 focus:outline focus:outline-primary-800"
													/>
													{errors._person?._rg && (
														<p className="text-sm text-red-500">{errors._person._rg.message}</p>
													)}
												</div>

												{/* Telefone */}
												<div className="mb-2">
													<label className="block text-gray-700">Tel:</label>
													<InputMask
														mask={"(99) 99999-9999"}
														type="text"
														{...register("_person._phone")}
														className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
													/>
													{errors._person?._phone && (
														<p className="text-sm text-red-500">{errors._person._phone.message}</p>
													)}
												</div>
											</>
										) : (
											<>
												<p>Nascimento: {formatDateToddmmYYYY(new Date(methods.getValues("_person._birthdate")) || data._person._birthdate)}</p>
												<p>CPF: {methods.getValues("_person._cpf._cpf") || data._person._cpf._cpf}</p>
												<p>RG: {methods.getValues("_person._rg") || data._person._rg}</p>
												<p>Tel: {formatPhone(methods.getValues("_person._phone") as Phone || data._person._phone)}</p>
											</>
										)}


										{isEditing ? (
											<>
												<p>Comorbidades:</p>
												<ul className="mt-2 flex flex-col flex-wrap gap-2 md:flex-row">
													{fields.map((comorbidity, index) => (
														<li key={comorbidity.id} className="flex items-center gap-2">
															<input
																type="text"
																{...register(`_comorbidities.${index}._name`)}
																className="rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800"
															/>
															<button
																type="button"
																onClick={() => remove(index)}
																className="text-red-500 hover:text-red-700"
															>
																Remover
															</button>
														</li>
													))}
												</ul>

												<button
													type="button"
													onClick={() => append({ _id: { _id: "" }, _name: "" })}
													className="mt-2 rounded-xl bg-primary-500 px-4 py-2 text-white hover:bg-primary-700"
												>
													Adicionar Comorbidade
												</button>
											</>
										) : (
											data._comorbidities.length > 0 && (
												<>
													<p>Comorbidades:</p>
													<ul className="mt-2 flex flex-col flex-wrap gap-2 md:flex-row">
														{data._comorbidities.map((comorbidity: comorbidityData) => (
															<ComorbidityTag name={comorbidity._name} key={comorbidity._id._id} />
														))}
													</ul>
												</>
											)
										)}
									</Square>

									{/* Informações dos Responsáveis */}
									{data._parents.length > 0 && (
										<>
											{data._parents.map((parent: ParentData, index) => (
												<Square
													variant={
														data._parents.length % 2 > 0 && index === data._parents.length - 1
															? "DoubleColumn"
															: "primary"
													}
													key={parent._id._id}
												>
													<SquareHeader titulo={`Informações de ${methods.getValues(`_parents.${index}._name`)}:`} />

													{isEditing ? (
														<>
															<div className="mb-2">
																<label className="block text-gray-700">Nascimento:</label>
																<input
																	type="date"
																	{...register(`_parents.${index}._birthdate`)}
																	defaultValue={formatDateToddmmYYYY(new Date(methods.getValues(`_parents.${index}._birthdate`))) as string}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
																{errors._parents?.[index]?._birthdate && (
																	<p className="text-sm text-red-500">{errors._parents[index]._birthdate.message}</p>
																)}
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">CPF:</label>
																<input
																	type="text"
																	disabled={true}
																	{...register(`_parents.${index}._cpf._cpf`)}
																	className="w-full rounded-xl border border-primary-500 bg-gray-500 p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
																{errors._parents?.[index]?._cpf?._cpf && (
																	<p className="text-sm text-red-500">{errors._parents[index]._cpf.message}</p>
																)}
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">RG:</label>
																<input
																	type="text"
																	disabled={true}
																	{...register(`_parents.${index}._rg`)}
																	className="w-full rounded-xl border border-primary-500 bg-gray-500 p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
																{errors._parents?.[index]?._rg && (
																	<p className="text-sm text-red-500">{errors._parents[index]._rg.message}</p>
																)}
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">Tel:</label>
																<InputMask
																	mask={"(99) 99999-9999"}
																	type="text"
																	{...register(`_parents.${index}._phone`)}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
																{errors._parents?.[index]?._phone && (
																	<p className="text-sm text-red-500">{errors._parents[index]._phone.message}</p>
																)}
															</div>
														</>
													) : (
														<>
															<p>Nascimento: {formatDateToddmmYYYY(new Date(parent._birthdate))}</p>
															<p>CPF: {parent._cpf._cpf}</p>
															<p>RG: {parent._rg}</p>
															<p>Tel: {formatPhone(parent._phone as Phone)}</p>
														</>
													)}
												</Square>
											))}
										</>
									)}

									{/* Escola */}
									{data._school && (
										<Square variant="DoubleColumn">
											<SquareHeader titulo="Escola" />
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="flex-col space-y-3">
													{isEditing ? (
														<>
															<div className="mb-2">
																<label className="block text-gray-700">Nome:</label>
																<input
																	type="text"
																	{...methods.register("_school._name")}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">Tel:</label>
																<InputMask
																	mask="(99) 99999-9999"
																	type="text"
																	{...register("_school._phone")}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
																{errors._school?._phone && (
																	<p className="text-sm text-red-500">{errors._school._phone.message}</p>
																)}
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">CNPJ:</label>
																<InputMask
																	mask="99.999.999/9999-99"
																	type="text"
																	{...register("_school._CNPJ._code")}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
																{errors._school?._CNPJ?._code && (
																	<p className="text-sm text-red-500">{errors._school._CNPJ._code.message}</p>
																)}
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">CEP:</label>
																<InputMask
																	mask="99999-999"
																	type="text"
																	{...register("_school._address._zipCode")}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
																{errors._school?._address?._zipCode && (
																	<p className="text-sm text-red-500">{errors._school._address._zipCode.message}</p>
																)}
															</div>
														</>
													) : (
														<>
															<p>Nome: {data._school._name}</p>
															<p>Tel: {formatPhone(data._school._phone as Phone)}</p>
															<p>CNPJ: {data._school._CNPJ._code}</p>
															<p>CEP: {data._school._address._zipCode}</p>
														</>
													)}
												</div>

												<div className="flex-col space-y-3">
													{isEditing ? (
														<>
															<div className="mb-2">
																<label className="block text-gray-700">Cidade:</label>
																<input
																	type="text"
																	{...methods.register("_school._address._city")}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">Estado:</label>
																<Controller
																	name="_school._address._state"
																	control={control}
																	render={({ field }) => (
																		<Select onValueChange={field.onChange} value={field.value}>
																			<SelectTrigger
																				className={
																					errors._school?._address?._state
																						? "w-full border-red-500 focus:ring-red-600"
																						: "w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																				}
																			>
																				<SelectValue placeholder="Selecione o estado" />
																			</SelectTrigger>
																			<SelectContent>
																				<SelectItem value="AC">Acre</SelectItem>
																				<SelectItem value="AL">Alagoas</SelectItem>
																				<SelectItem value="AP">Amapá</SelectItem>
																				<SelectItem value="AM">Amazonas</SelectItem>
																				<SelectItem value="BA">Bahia</SelectItem>
																				<SelectItem value="CE">Ceará</SelectItem>
																				<SelectItem value="DF">Distrito Federal</SelectItem>
																				<SelectItem value="ES">Espírito Santo</SelectItem>
																				<SelectItem value="GO">Goiás</SelectItem>
																				<SelectItem value="MA">Maranhão</SelectItem>
																				<SelectItem value="MT">Mato Grosso</SelectItem>
																				<SelectItem value="MS">Mato Grosso do Sul</SelectItem>
																				<SelectItem value="MG">Minas Gerais</SelectItem>
																				<SelectItem value="PA">Pará</SelectItem>
																				<SelectItem value="PB">Paraíba</SelectItem>
																				<SelectItem value="PR">Paraná</SelectItem>
																				<SelectItem value="PE">Pernambuco</SelectItem>
																				<SelectItem value="PI">Piauí</SelectItem>
																				<SelectItem value="RJ">Rio de Janeiro</SelectItem>
																				<SelectItem value="RN">Rio Grande do Norte</SelectItem>
																				<SelectItem value="RS">Rio Grande do Sul</SelectItem>
																				<SelectItem value="RO">Rondônia</SelectItem>
																				<SelectItem value="RR">Roraima</SelectItem>
																				<SelectItem value="SC">Santa Catarina</SelectItem>
																				<SelectItem value="SP">São Paulo</SelectItem>
																				<SelectItem value="SE">Sergipe</SelectItem>
																				<SelectItem value="TO">Tocantins</SelectItem>
																			</SelectContent>
																		</Select>
																	)}
																/>
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">Bairro:</label>
																<input
																	type="text"
																	{...methods.register("_school._address._district")}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">Rua:</label>
																<input
																	type="text"
																	{...methods.register("_school._address._street")}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
															</div>

															<div className="mb-2">
																<label className="block text-gray-700">Complemento:</label>
																<input
																	type="text"
																	{...methods.register("_school._address._complement")}
																	className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																/>
															</div>
														</>
													) : (
														<>
															<p>Cidade: {data._school._address._city}, {data._school._address._state}</p>
															<p>Bairro: {data._school._address._district}</p>
															<p>Rua: {data._school._address._street}, {data._school._address._homeNumber}</p>
															<p>Complemento: {data._school._address._complement}</p>
														</>
													)}
												</div>
											</div>
										</Square>
									)}

									{/* Medicamento */}
									{data._medicines.length > 0 && (
										<>
											{data._medicines.map(
												(medicine: MedicineData, index) => (
													<Square
														variant={
															data._medicines.length % 2 > 0 &&
																index === data._medicines.length - 1
																? "DoubleColumn"
																: "primary"
														}
														key={medicine._medicine_id}
													>
														<SquareHeader
															titulo={`Informações de ${medicine._medicine._name}:`}
														/>
														<p>
															Dosagem: {medicine._dosage}&nbsp;
															{medicine._dosageUnity}
														</p>
														<p>
															Horários:&nbsp;
															{formatMedicineSchedule(
																medicine._schedules
															)}
														</p>
														<p>
															Data de início:&nbsp;
															{formatDateToddmmYYYY(
																medicine._startDate
															)}
														</p>
														<p>Observação: {medicine._observation}</p>
													</Square>
												)
											)}
										</>
									)}

									{/* Endereço */}
									<Square variant="DoubleColumn">
										<SquareHeader titulo="Endereço" />
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{isEditing ? (
												<>
													<div>
														<label className="block text-gray-700">
															CEP:
														</label>
														<InputMask
															type="text"
															mask={"99999-999"}
															{...register(
																"_person.address._zipCode"
															)}
															className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
														/>
														{errors._person?.address
															?._zipCode && (
																<p className="text-sm text-red-500">
																	{
																		errors._person
																			.address
																			._zipCode
																			.message
																	}
																</p>
															)}
														<label className="block text-gray-700">
															Cidade:
														</label>
														<input
															type="text"
															{...register(
																"_person.address._city"
															)}
															className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
														/>
														{errors._person?.address
															?._city && (
																<p className="text-sm text-red-500">
																	{
																		errors._person
																			.address
																			._city
																			.message
																	}
																</p>
															)}
														<label className="block text-gray-700">
															Estado:
														</label>
														<Controller
															name="_person.address._state"
															control={control}
															render={({ field }) => (
																<Select
																	onValueChange={
																		field.onChange
																	}
																	value={
																		field.value
																	}
																>
																	<SelectTrigger
																		className={
																			errors
																				._person
																				?.address
																				?._state
																				? "w-full border-red-500 focus:ring-red-600"
																				: "w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
																		}
																	>
																		<SelectValue placeholder="Selecione o estado" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="AC">Acre</SelectItem>
																		<SelectItem value="AL">Alagoas</SelectItem>
																		<SelectItem value="AP">Amapá</SelectItem>
																		<SelectItem value="AM">Amazonas</SelectItem>
																		<SelectItem value="BA">Bahia</SelectItem>
																		<SelectItem value="CE">Ceará</SelectItem>
																		<SelectItem value="DF">Distrito Federal</SelectItem>
																		<SelectItem value="ES">Espírito Santo</SelectItem>
																		<SelectItem value="GO">Goiás</SelectItem>
																		<SelectItem value="MA">Maranhão</SelectItem>
																		<SelectItem value="MT">Mato Grosso</SelectItem>
																		<SelectItem value="MS">Mato Grosso do Sul</SelectItem>
																		<SelectItem value="MG">Minas Gerais</SelectItem>
																		<SelectItem value="PA">Pará</SelectItem>
																		<SelectItem value="PB">Paraíba</SelectItem>
																		<SelectItem value="PR">Paraná</SelectItem>
																		<SelectItem value="PE">Pernambuco</SelectItem>
																		<SelectItem value="PI">Piauí</SelectItem>
																		<SelectItem value="RJ">Rio de Janeiro</SelectItem>
																		<SelectItem value="RN">Rio Grande do Norte</SelectItem>
																		<SelectItem value="RS">Rio Grande do Sul</SelectItem>
																		<SelectItem value="RO">Rondônia</SelectItem>
																		<SelectItem value="RR">Roraima</SelectItem>
																		<SelectItem value="SC">Santa Catarina</SelectItem>
																		<SelectItem value="SP">São Paulo</SelectItem>
																		<SelectItem value="SE">Sergipe</SelectItem>
																		<SelectItem value="TO">Tocantins</SelectItem>
																	</SelectContent>
																</Select>
															)}
														/>
														{errors._person?.address
															?._state && (
																<p className="text-sm text-red-500">
																	{
																		errors._person
																			.address
																			._state
																			.message
																	}
																</p>
															)}
														<label className="block text-gray-700">
															Bairro:
														</label>
														<input
															type="text"
															{...register(
																"_person.address._district"
															)}
															className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
														/>
														{errors._person?.address
															?._district && (
																<p className="text-sm text-red-500">
																	{
																		errors._person
																			.address
																			._district
																			.message
																	}
																</p>
															)}
													</div>
													<div>

														<label className="block text-gray-700">
															Rua:
														</label>
														<input
															type="text"
															{...register(
																"_person.address._street"
															)}
															className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
														/>
														{errors._person?.address
															?._street && (
																<p className="text-sm text-red-500">
																	{
																		errors._person
																			.address
																			._street
																			.message
																	}
																</p>
															)}
														<label className="block text-gray-700">
															Número:
														</label>
														<input
															type="text"
															{...register(
																"_person.address._homeNumber"
															)}
															className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
														/>
														{errors._person?.address
															?._homeNumber && (
																<p className="text-sm text-red-500">
																	{
																		errors._person
																			.address
																			._homeNumber
																			.message
																	}
																</p>
															)}
														<label className="block text-gray-700">
															Complemento:
														</label>
														<input
															type="string"
															{...register(
																"_person.address._complement"
															)}
															className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
														/>
														{errors._person?.address
															?._complement && (
																<p className="text-sm text-red-500">
																	{
																		errors._person
																			.address
																			._complement
																			.message
																	}
																</p>
															)}
													</div>
												</>)
												:
												<>
													<div className="flex-col space-y-3">
														<p>CEP: {data._person.address?._zipCode}</p>
														<p>
															Cidade: {data._person.address?._city},&nbsp;
															{data._person.address?._state}
														</p>
														<p>Bairro: {data._person.address?._district}</p>
													</div>
													<div className="flex-col space-y-3">
														<p>
															Rua: {data._person.address?._street},&nbsp;
															{data._person.address?._homeNumber}
														</p>
														<p>
															Complemento: {data._person.address?._complement}
														</p>
													</div>
												</>
											}
										</div>
									</Square>

									{
										!isEditing &&
										<>
											{/* Arquivos */}
											<Square variant="primary">
												<SquareHeader titulo="Arquivos de acompanhamentos anteriores" />
												<ul>
													{data._previewFollowUps &&
														data._previewFollowUps.length > 0 ? (
														data._previewFollowUps.map((followUp, index) => (
															<ListComponent
																link={followUp._docLink}
																content={followUp._title}
																id={followUp._id._id}
																key={followUp._id._id}
																variant={
																	index === 0 ? "IsFirst" : "NotFirst"
																}
															/>
														))
													) : (
														<p className="text-center">
															Nenhum Acompanhamento anterior
														</p>
													)}
												</ul>
											</Square>

											{/* Histórico de Sessões */}
											<Square variant="WithButton">
												<SquareHeader titulo="Histórico de Sessões" />
												<Button className="bg-primary-600 hover:bg-primary-700">
													<Link href={"/patients/" + params.id + "/past_sessions?name=" + data._person._name}>Ver Histórico de Sessões</Link>
												</Button>
											</Square>
										</>
									}
								</div>
								{isEditing && (
									<div className="flex gap-3">
										<button
											onClick={() => {
												setIsEditing(false);
												//methods.reset(data);
											}}
											disabled={loading}
											className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
										>
											Cancelar
										</button>
										<button
											type="submit"
											disabled={loading}
											className="mt-4 rounded bg-primary-600 px-4 py-2 text-white"
										>
											{!loading ? "Salvar" : "Carregando..."}
										</button>
									</div>
								)}
							</form>
						</section>
					</>
				}

			</main>
		</FormProvider>
	);
}
