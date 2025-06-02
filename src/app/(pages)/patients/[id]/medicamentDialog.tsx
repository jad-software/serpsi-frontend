import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, use, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MedicineData, MedicineSchema } from "./patientSchema";
import { InputText } from "@/components/form/InputText";
import { Input } from "@/components/ui/input";
import { addMedicament, deleteMedicament } from "@/services/medicineService";
import { toast } from "sonner";
import moment from "moment";
import { set } from "zod";

type medicamentDialogProps = {
	triggerButton: ReactNode;
	onSuccess?: (data: any) => void;
	medicament?: MedicineData;
	patientId: string;
};

export function MedicamentDialog({
	triggerButton,
	onSuccess,
	medicament,
	patientId
}: medicamentDialogProps) {
	const [isOpened, setOpen] = useState(false);
	const [data, setData] = useState<MedicineData>({} as MedicineData);
	const methods = useForm<MedicineData>({
		resolver: zodResolver(MedicineSchema)
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = methods;
	const [hasMed, setHasMed] = useState(false);
	useEffect(() => {
		if (medicament) {
			setHasMed(true);
			methods.reset(medicament);
			setData(medicament);
		}
	}, [medicament, methods, data]);
	const onSubmit = async (data: MedicineData) => {
		const medicamento: any = [
			{
				medicine: {
					name: data._medicine._name
				},
				dosage: data._dosage,
				dosageUnity: data._dosageUnity,
				frequency: data._frequency,
				firstTimeOfTheDay: data._firstTimeOfTheDay,
				startDate: data._startDate.toISOString(),
				observation: data._observation
			}
		];
		try {
			const response = await addMedicament(medicamento, patientId);
			toast.success("Lista de medicamentos alterada com sucesso.");
			setOpen(false);
			onSuccess?.(data);
		} catch (error) {
			toast.error("Erro ao modificar a lista de medicamentos.");
		}
	};
	function handleDelete(data: MedicineData) {
		toast.promise(
			deleteMedicament(
				patientId,
				(data._medicine_id || data._medicine._id?._id) as string
			),
			{
				loading: "Excluindo medicamento...",
				success: (data) => {
					setOpen(false);
					onSuccess?.(data);
					return "Medicamento excluído com sucesso.";
				},
				error: "Erro ao excluir o medicamento."
			}
		);
	}

	return (
		<>
			<Dialog open={isOpened} onOpenChange={setOpen}>
				<DialogTrigger asChild>{triggerButton}</DialogTrigger>
				<DialogContent className="lg:w-[60%]">
					<DialogHeader>
						<DialogTitle className="font-normal text-primary-600">
							Medicamento {medicament?._medicine._name}
						</DialogTitle>
						<DialogDescription>
							Preencha as informações da conta.
						</DialogDescription>
					</DialogHeader>
					<form
						id="form-medicamento"
						className="mt-1 grid grid-cols-1 gap-4 md:grid-cols-2"
						onSubmit={(event) => {
							event.preventDefault();
							event.stopPropagation();
							handleSubmit(onSubmit, (err) => console.log(err))(
								event
							);
						}}
					>
						<div className="flex flex-col gap-3">
							<div>
								<InputText
									id={`nome-medicamento`}
									label="Nome do Medicamento:"
									placeholder={`Nome do Medicamento`}
									type="text"
									name={`_medicine._name`}
									register={register}
									error={errors._medicine?._name?.message}
								/>
							</div>
							<div>
								<InputText
									id={`frq-diaria`}
									label="Frequência Diária:"
									placeholder="Digite a Frequência Diária"
									type="number"
									name={`_frequency`}
									register={register}
									error={errors._frequency?.message}
								/>
							</div>
							<div>
								<InputText
									id={`dosagem-medicamento`}
									label="Dosagem do Medicamento:"
									placeholder="Ex: 5"
									type="number"
									name={`_dosage`}
									register={register}
									error={errors._dosage?.message}
								/>
							</div>
							<div>
								<InputText
									id={`unidade-dosagem-medicamento`}
									label="Unidade de Medida da Dosagem:"
									placeholder="Ex: mg"
									type="text"
									name={`_dosageUnity`}
									register={register}
									error={errors._dosageUnity?.message}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-3">
							<div>
								<label
									htmlFor={`data-inicio-medicamento`}
									className="mb-1 block text-sm text-primary-950"
								>
									Data de Início do Medicamento:
								</label>
								<Controller
									name={`_startDate`}
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="data-inicio-medicamento"
											type="date"
											value={
												(field.value &&
													moment
														.utc(field.value)
														.format(
															"YYYY-MM-DD"
														)) ??
												""
											}
											className={`w-full rounded-md border p-2 text-left ${
												errors._startDate?.message
													? "border-red-500 ring-red-600"
													: "border-primary-600 ring-primary-600"
											}`}
										/>
									)}
								/>
								{errors._startDate?.message && (
									<span className="text-sm text-red-500">
										{errors._startDate?.message}
									</span>
								)}
							</div>
							<div>
								<label
									htmlFor={`hora-inicio-medicamento`}
									className="mb-1 block text-sm text-primary-950"
								>
									Horário da Primeira Dose:
								</label>
								<Controller
									name={`_firstTimeOfTheDay`}
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="hora-inicio-medicamento"
											type="time"
											placeholder="Ex: 8"
											value={
												field.value &&
												moment(field.value).isValid()
													? moment
															.utc(field.value)
															.format("HH:mm")
													: ""
											}
											onChange={(e) => {
												const localTime = moment
													.utc(
														e.target.value,
														"HH:mm"
													)
													.toISOString();
												field.onChange(localTime);
											}}
											className={`w-full rounded-md border p-2 text-left ${
												errors._startDate?.message
													? "border-red-500 ring-red-600"
													: "border-primary-600 ring-primary-600"
											}`}
										/>
									)}
								/>
								{errors._firstTimeOfTheDay?.message && (
									<span className="text-sm text-red-500">
										{errors._firstTimeOfTheDay?.message}
									</span>
								)}
							</div>
							<div>
								<InputText
									id={`obs-medicamento`}
									label="Observações do Medicamento"
									placeholder="Digie as observações"
									type="text"
									name={`_observation`}
									register={register}
									error={errors._observation?.message}
								/>
							</div>
						</div>
						<div className="flex w-full justify-end gap-4 md:col-span-2">
							{hasMed && (
								<Button
									className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-600/70"
									onClick={() => {
										handleDelete(data);
										window.location.reload();
									}}
									type="button"
								>
									Deletar
								</Button>
							)}
							<Button
								className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600/70"
								type="submit"
								form="form-medicamento"
							>
								{hasMed ? "Editar" : "Adicionar"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
