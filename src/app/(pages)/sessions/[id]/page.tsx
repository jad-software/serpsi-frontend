"use client";
import { Square, SquareHeader } from "../../patients/[id]/Square";
import Link from "next/link";
import psiImage from "/public/img/avatar.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ListComponent } from "../../patients/[id]/listComponent";
import { PencilAltIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import RichTextEditor from "@/components/richEditor/richEditor";
import TurndownService from "turndown";
import { ConfirmSessionDialog } from "./confirmSessionDialog";
import { CancelSessionDialog } from "./cancelSessionDialog";
import { toast } from "sonner";
import { getMeeting, updateMeetingPaymentMethod, updateMeetingStatus } from "@/services/meetingsService";
import { MeetingData } from "@/models/Entities/ Meeting";
import { formatToCurrency } from "@/services/utils/formatCurrency";
import { formatDateToddmmYYYY } from "@/services/utils/formatDate";
import { formatPhone } from "@/services/utils/formatPhone";
import { PaymentMethod, PaymentPossibilities } from "@/models/Entities/PaymentMethod";
import { getCookies } from "@/services/profileService";

type FileData = {
	id: string;
	_docLink: string;
	_title: string;
};

export default function SpecificSessions({
	params
}: {
	params: { id: string };
}) {
	const [data, setData] = useState<FileData[]>([]);
	const [content, setContent] = useState<string>("");
	const [meetingData, setMeetingData] = useState({} as MeetingData);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const turndownService = new TurndownService();
	useEffect(() => {
		async function getMeetingData() {
			const response = await getMeeting(params.id);
			console.log(response);
			setMeetingData(response);
			setData(response._documents as FileData[])
		}
		getMeetingData();
	}, [params.id])
	const handleSubmit = () => {
		const markdownContent = turndownService.turndown(content);

		const blob = new Blob([markdownContent], { type: "text/markdown" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "document.md";
		// console.log('link', link);
		link.click();
	};

	const handleConfirmSession = async (paymentType: string) => {
		const paymentMethod: PaymentMethod = {
			paymentDate: meetingData._bill._dueDate,
			paymentType: paymentType as PaymentPossibilities
		};
		
		const result = await updateMeetingPaymentMethod(meetingData._bill._id._id, paymentMethod);
		if(result){
			toast.promise(updateMeetingStatus(params.id, "CONFIRMADO"), {
				loading: "carregando",
				success: () => {
					setMeetingData(prev => ({ ...prev, _status: "CONFIRMADO" }));
					

					return "Sessão Confirmada";
				},
				error: () => {
					return "Algo deu errado"
				}
			})
		}

	
	};

	const handleCancelSession = () => {
		console.log('Sessão cancelada');
		toast.promise(updateMeetingStatus(params.id, "CANCELADO"), {
			loading: "carregando",
			success: () => {
				setMeetingData(prev => ({ ...prev, _status: "CANCELADO" }));
				return "Sessão cancelada";
			},
			error: () => {
				return "Algo deu errado"
			}
		})
	};

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
	
		const files = Array.from(event.target.files);
		const formData = new FormData();
		const jwt = await getCookies();
	
		files.forEach((file) => {
				formData.append("documents", file);
		});
		formData.append("meeting", params.id);
		try {
				const response = await fetch(	process.env.NEXT_PUBLIC_BACKEND_URL + "/documents/aditional", {
						method: "POST",
						headers:{
							Authorization: jwt, 
						},
						body: formData
				});
	
				if (!response.ok) {
						throw new Error("Erro ao enviar arquivos");
				}
	
				const result = await response.json();
				toast.success("Arquivos enviados com sucesso!");
				setData((prevData) => [
						...prevData,
						...result.map((file: { id: string; _docLink: string; _title: string }) => ({
								id: file.id,
								_docLink: file._docLink,
								_title: file._title
						}))
				]);
		} catch (error) {
				toast.error("Erro ao enviar arquivos");
				console.error(error);
		}
	};
	
	return (
		<div className="container mx-auto p-4">
			<div className="grid grid-cols-1 gap-4 gap-x-4 md:grid-cols-[max-content_1fr]">
				{/* Sessão do paciente com a foto e botões */}
				<Square variant="WithImage" className="md:col-span-1">
					<div className="flex w-3/4 flex-col items-center">
						<Image
							className="mb-4 h-24 w-24 rounded-full"
							src={
								meetingData._patient?._person?._profilePicture
									? meetingData._patient._person._profilePicture
									: psiImage}
							alt="Profile"
							width={100}
							height={100}
						/>
						<div className="mb-2 flex flex-row items-center justify-center gap-2">
							<span className="text-lg text-gray-900">
								{meetingData._patient?._person?._name}
							</span>
							<Link href={"/patients/"}>
								<PencilAltIcon
									width={24}
									height={24}
									className="cursor-pointer text-primary-600"
								/>
							</Link>

						</div>
						{(meetingData?._status === 'CONFIRMADO' || meetingData?._status === 'CANCELADO') &&
							<>
								<p className={`${meetingData?._status === 'CONFIRMADO' ? 'text-cyan-600' : 'text-red-600'}`}>
									{`Sessão ${meetingData?._status === 'CONFIRMADO' ? 'Confirmada' : 'Cancelada'}`}
								</p>
							</>}

					</div>
					<div className="flex w-full flex-col gap-2 md:flex-row md:justify-center md:space-x-14">
						{
							meetingData?._status === 'ABERTO' &&
							<ConfirmSessionDialog
								onConfirm={handleConfirmSession}
								triggerButton={
									<button className="w-full flex-1 rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600/70">
										Confirmar{" "}
										<br className="hidden md:inline" />
										Sessão
									</button>
								}
							/>
						}
						{
							(meetingData?._status === 'ABERTO' || meetingData?._status !== 'CANCELADO') &&
							<CancelSessionDialog
								onCancel={handleCancelSession}
								triggerButton={
									<button className="flex-1 rounded border border-primary-600 bg-transparent p-2 text-primary-600 hover:bg-primary-100/70 hover:text-primary-600 md:w-48">
										Cancelar{" "}
										<br className="hidden md:inline" />
										Sessão
									</button>
								}
							/>
						}


					</div>
				</Square>

				{/* Informações do paciente */}
				<Square>
					<SquareHeader titulo="Informações do paciente:" />
					<div className="flex flex-col gap-3 md:flex-row md:gap-9 overflow-auto">
						<div>
							<p>Nascimento: {formatDateToddmmYYYY(meetingData?._patient?._person?._birthdate)}</p>
							<p>CPF: {meetingData?._patient?._person._cpf._cpf}</p>
							<p>Tel: {meetingData?._patient?._person._phone && formatPhone(meetingData._patient._person._phone, false)}</p>
						</div>
						{meetingData?._patient?._parents.map((parrent, index) => {
							return (
								<div key={parrent._id._id}>
									<p>Responsável {index + 1}: {parrent._name}</p>

									<p>CPF Responsável {index + 1}: {parrent._cpf._cpf}</p>
									<p>Tel Responsável {index + 1}: {parrent._phone && formatPhone(parrent._phone, false)}</p>
								</div>
							)
						})}

					</div>

				</Square>

				{/* Forma de pagamento e valor */}
				<Square className="p-4 md:col-span-1">
					<div className="flex flex-col space-y-2">
						<div className="flex flex-col">
							<label
								className="mb-2 text-gray-900"
								htmlFor="forma-pagamento"
							>
								Forma de pagamento:
							</label>
							<select className="w-full rounded border border-r-8 border-transparent p-2 outline outline-primary-400">
								<option value={'A RECEBER'} >Pendente</option>
								<option value={'A PAGAR'}>Pago</option>
							</select>
						</div>
						<div className="flex flex-col">
							<label
								className="mb-2 text-gray-900"
								htmlFor="valor-sessao"
							>
								Valor da sessão:
							</label>
							<input
								id="valor-sessao"
								type="text"
								value={
									meetingData?._bill?._amount !== undefined
										? meetingData._bill._amount.toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})
										: ""
								}
								className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-500"
								disabled
							/>

						</div>
					</div>
				</Square>

				{/* Relato da sessão */}
				<Square variant="ThreeRows" className="md:col-span-3">
					<SquareHeader titulo="Relato da sessão:" />
					<RichTextEditor value={content} onChange={setContent} />
					<div className="mt-3 flex justify-end">
						<Button
							onClick={handleSubmit}
							className="rounded bg-primary-600 px-8 py-2 text-white hover:bg-primary-600/70"
						>
							Salvar
						</Button>
					</div>
				</Square>

				{/* Arquivos da sessão */}
				<Square className="md:col-span-1">
					<SquareHeader titulo="Arquivos desta sessão:" />
					<ul className="md:max-h-30 max-h-40 overflow-auto">
						{data.length > 0 ? (
							data.map((followUp, index) => (
								<ListComponent
									link={followUp._docLink}
									content={followUp._title}
									id={index.toString()}
									key={index}
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

					<div className="mt-2 flex justify-end">
						<label
							htmlFor="arquivos"
							className="cursor-pointer rounded-md border border-primary-600 bg-transparent p-2 text-primary-600 hover:bg-primary-100/70 hover:text-primary-600"
						>
							Adicionar Arquivos
						</label>
						<input
							type="file"
							id="arquivos"
							accept="application/pdf"
							className="hidden"
							multiple={true}
							onChange={handleFileUpload}
						/>
					</div>
				</Square>

				{/* Botão para ver histórico de sessões */}
				<Square className="flex items-center justify-center md:col-span-1">
					<button className="w-full rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600/70">
						Ver Histórico de Sessões
					</button>
				</Square>
			</div>
		</div>
	);
}
