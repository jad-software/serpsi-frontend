import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import React from "react";

interface ExtraInfoProps {
	progress: number;
	componentIndex: number;
}

type ExtraInfoForm = {
	paymentPlan: string;
	checkMedicines: boolean;
	comorbidities?: string | undefined;
	previousDocuments?: any;
	medicines?:
		| (
				| {
						name: string;
						dosage: number;
						dosageUnity: string;
						frequency: number;
						firstTimeOfTheDay: string;
						startDate: Date | undefined;
						observation?: string | undefined;
				  }
				| undefined
		  )[]
		| undefined;
};

export default function ExtraInfoSection({
	progress,
	componentIndex
}: ExtraInfoProps) {
	// const [medicineNumber, setMedicineNumber] = useState<number>(1);

	const {
		control,
		register,
		watch,
		formState: { errors }
	} = useFormContext<ExtraInfoForm>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "medicines"
	});

	const addMedicine = () => {
		append({
			name: "",
			dosage: 0,
			dosageUnity: "",
			frequency: 0,
			firstTimeOfTheDay: "",
			startDate: undefined,
			observation: ""
		});
	};

	const removeMedicine = () => {
		remove(fields.length - 1);
	};

	const removeAllMedicine = () => {
		remove();
	};

	return (
		<FormSection
			currentStep={progress}
			componentStep={componentIndex}
			title="Informações Adicionais"
		>
			<>
				<div>
					<InputText
						id="comorbidades"
						label="Possui Diagnósticos? se Sim, Qual(is)?"
						placeholder="Diagnóstico 1, Diagnóstico 2, ..."
						type="text"
						name="comorbidities"
						register={register}
						error={errors.comorbidities?.message}
					/>
				</div>
				<div>
					<InputText
						id="acompanhamentos"
						label="Acompanhamentos anteriores:"
						placeholder=""
						type="file"
						name="previousDocuments"
						accept="application/pdf"
						register={register}
						error={
							errors.previousDocuments
								? errors.previousDocuments.message?.toString()
								: undefined
						}
					/>
				</div>
				<div>
					<label
						className="mb-1 w-full text-sm font-normal text-primary-950"
						htmlFor="paymentPlan"
					>
						Plano de Pagamento:
					</label>

					<Controller
						name="paymentPlan"
						control={control}
						render={({ field }) => (
							<Select
								onValueChange={field.onChange}
								value={field.value}
							>
								<SelectTrigger
									className={
										errors.paymentPlan?.message
											? "w-full border-red-500 focus:ring-red-600"
											: "w-full border-primary-400 focus:ring-primary-500"
									}
								>
									<SelectValue placeholder="Selecione o plano de pagamento..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="AVULSA">
										Avulso
									</SelectItem>
									<SelectItem value="MENSAL">
										Mensal
									</SelectItem>
									<SelectItem value="BIMESTRAL">
										Bimestral
									</SelectItem>
									<SelectItem value="TRIMESTRAL">
										Trimestral
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.paymentPlan?.message && (
						<span className="text-sm text-red-400">
							{errors.paymentPlan?.message}
						</span>
					)}
				</div>
				<br />

				<div className="flex w-full items-center justify-start">
					<input
						className="mr-2 h-4 w-4 accent-primary-600"
						id="checkMedicines"
						type="checkbox"
						{...register("checkMedicines")}
						onChange={(event) => {
							if (event.target.checked) {
								addMedicine();
							} else {
								removeAllMedicine();
							}
						}}
					/>
					<label htmlFor="checkMedicines">
						Faz uso de medicamentos.
					</label>
				</div>
				<br />
				{fields.map((value, index) => (
					<React.Fragment key={value.id}>
						{index > 0 && <hr className="col-span-2 my-2 border" />}
						<div>
							<InputText
								id={`nome-medicamento-${index}`}
								label="Nome do Medicamento:"
								placeholder={`Nome do Medicamento ${index}`}
								type="text"
								name={`medicines.${index}.name`}
								register={register}
								error={errors.medicines?.[index]?.name?.message}
							/>
						</div>
						<div>
							<InputText
								id={`frq-diaria-${index}`}
								label="Frequência Diária:"
								placeholder="Digite a Frequência Diária"
								type="number"
								name={`medicines.${index}.frequency`}
								register={register}
								error={
									errors.medicines?.[index]?.frequency
										?.message
								}
							/>
						</div>
						<div>
							<InputText
								id={`dosagem-medicamento-${index}`}
								label="Dosagem do Medicamento:"
								placeholder="Ex: 5"
								type="number"
								name={`medicines.${index}.dosage`}
								register={register}
								error={
									errors.medicines?.[index]?.dosage?.message
								}
							/>
						</div>
						<div>
							<InputText
								id={`unidade-dosagem-medicamento-${index}`}
								label="Unidade de Medida da Dosagem:"
								placeholder="Ex: mg"
								type="text"
								name={`medicines.${index}.dosageUnity`}
								register={register}
								error={
									errors.medicines?.[index]?.dosageUnity
										?.message
								}
							/>
						</div>
						<div>
							<InputText
								id={`data-inicio-medicamento-${index}`}
								label="Data de Início do Medicamento:"
								placeholder=""
								type="date"
								name={`medicines.${index}.startDate`}
								register={register}
								error={
									errors.medicines?.[index]?.startDate
										?.message
								}
							/>
						</div>
						<div>
							<InputText
								id={`data-inicio-medicamento-${index}`}
								label="Horário da Primeira Dose:"
								placeholder="Ex: 8"
								type="time"
								name={`medicines.${index}.firstTimeOfTheDay`}
								register={register}
								error={
									errors.medicines?.[index]?.firstTimeOfTheDay
										?.message
								}
							/>
						</div>
						<div>
							<InputText
								id={`obs-medicamento-${index}`}
								label="Observações do Medicamento"
								placeholder="Digie as observações"
								type="text"
								name={`medicines.${index}.observation`}
								register={register}
								error={
									errors.medicines?.[index]?.observation
										?.message
								}
							/>
						</div>
						<br />
						{index === fields.length - 1 && (
							<Button
								className="bg-primary-600 text-left hover:bg-primary-400"
								onClick={addMedicine}
								type={"button"}
							>
								<PlusIcon width={18} height={18} />
								&nbsp; Adicionar Outro Medicamento
							</Button>
						)}
						{fields.length > 1 && index === fields.length - 1 && (
							<Button
								className="text-left"
								onClick={removeMedicine}
								type={"button"}
							>
								<TrashIcon width={18} height={18} />
								&nbsp; Remover Medicamento
							</Button>
						)}
					</React.Fragment>
				))}
			</>
		</FormSection>
	);
}
