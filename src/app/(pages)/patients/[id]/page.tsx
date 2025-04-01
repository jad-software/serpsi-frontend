"use client"
import Image from "next/image";
import { Square, SquareHeader } from "./Square";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { ComorbidityTag } from "./comorbidityTag";
import Link from "next/link";
import { formatMedicineSchedule, getData } from "@/services/myPatientService";
import { Comorbidity, MedicamentInfo, Patient, Person } from "@/models";
import { ListComponent } from "./listComponent";
import { formatDateToddmmYYYY } from "@/services/utils/formatDate";
import { formatPhone } from "@/services/utils/formatPhone";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function MyPatient({
	params
}: {
	params: { id: string };
}) {
	const [data, setData] = useState<Patient>({} as Patient);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function dataReceive() {
			const result = await getData(params.id);
			setData(result);
			console.log('result', result)
			setIsLoading(false);
		}
		dataReceive();
	}, [params.id]);


	return (

		<main className="flex flex-col items-center justify-center bg-cover px-10 py-5">
			{isLoading 
			? 
			<>
			<p> Carregando...</p>
			</>
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
				<div className="grid w-full grid-cols-1 gap-4 md:w-3/4 md:grid-cols-2">
					{/* Card do Perfil */}
					<Square variant="WithImage">

						<Image
							className="mb-4 h-24 w-24 rounded-full"
							src={data._person._profilePicture ?? ""}
							width={100}
							height={100}
							alt="Profile"
							unoptimized={true}
						/>
						<h2 className="text-xl font-semibold">
							{data._person._name}
						</h2>
						{/* <div className="flex items-center gap-2">
						<a
							href="#"
							className="mt-2 text-sm text-primary-700 no-underline"
						>
							Visualizar Documentos
						</a>
						<DocumentMagnifyingGlassIcon className="mt-2 h-6 w-6 text-sm text-primary-700 underline hover:cursor-pointer" />
					</div> */}
					</Square>

					{/* Informações do Paciente */}
					<Square>
						<SquareHeader titulo="Informações do paciente" />
						<p>
							Nascimento:{" "}
							{formatDateToddmmYYYY(data._person._birthdate)}
						</p>
						<p>CPF: {data._person._cpf._cpf}</p>
						<p>RG: {data._person._rg}</p>
						<p>Tel: {formatPhone(data._person._phone)}</p>
						{data._comorbidities.length > 0 && (
							<>
								<p>Comorbidades:</p>
								<ul className="mt-2 flex flex-col flex-wrap gap-2 md:flex-row">
									{data._comorbidities.map(
										(comorbidity: Comorbidity) => (
											<ComorbidityTag
												name={comorbidity._name}
												key={comorbidity._id._id}
											/>
										)
									)}
								</ul>
							</>
						)}
					</Square>

					{/* Informações dos Responsáveis */}
					{data._parents.length > 0 && (
						<>
							{data._parents.map((parent: Person, index) => (
								<Square
									variant={
										data._parents.length % 2 > 0 &&
											index === data._parents.length - 1
											? "DoubleColumn"
											: "primary"
									}
									key={parent._id._id}
								>
									<SquareHeader
										titulo={`Informações de ${parent._name}:`}
									/>
									<p>
										Nascimento:{" "}
										{formatDateToddmmYYYY(parent._birthdate)}
									</p>
									<p>CPF: {parent._cpf._cpf}</p>
									<p>RG: {parent._rg}</p>
									<p>Tel: {formatPhone(parent._phone)}</p>
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
									<p>Nome: {data._school._name}</p>
									<p>Tel: {formatPhone(data._school._phone)}</p>
									<p>CNPJ: {data._school._CNPJ._code}</p>
									<p>CEP: {data._school._address._zipCode}</p>
								</div>
								<div className="flex-col space-y-3">
									<p>
										Cidade: {data._school._address._city},&nbsp;
										{data._school._address._state}
									</p>
									<p>Bairro: {data._school._address._district}</p>
									<p>
										Rua: {data._school._address._street},&nbsp;
										{data._school._address._homeNumber}
									</p>
									<p>
										Complemento:{" "}
										{data._school._address._complement}
									</p>
								</div>
							</div>
						</Square>
					)}

					{/* Medicamento */}
					{data._medicines.length > 0 && (
						<>
							{data._medicines.map(
								(medicine: MedicamentInfo, index) => (
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
						</div>
					</Square>

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
							<Link href={"/patients/" + params.id + "/past-sessions?name=" + data._person._name}>Ver Histórico de Sessões</Link>
						</Button>
					</Square>
				</div>
			</> 
			}
			
		</main>
	);
}
