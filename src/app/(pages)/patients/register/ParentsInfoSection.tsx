import { FormSection } from "./FormSection";
import { InputText } from "@/components/form/InputText";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { useFieldArray, useFormContext } from "react-hook-form";

interface ParentsInfoProps {
	progress: number;
	componentIndex: number;
}

type ParentsInfoForm = {
	parents: {
		name: string;
		rg: string;
		birthdate: Date | undefined;
		phone: string;
		cpf: string;
	}[];
};

export default function ParentsInfoSection({
	progress,
	componentIndex
}: ParentsInfoProps) {
	const {
		control,
		register,
		formState: { errors }
	} = useFormContext<ParentsInfoForm>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "parents"
	});

	const addParent = () => {
		append({ name: "", rg: "", birthdate: undefined, phone: "", cpf: "" });
	};

	const removeParent = () => {
		remove(fields.length - 1);
	};

	return (
		<>
			{fields.map((value, index) => (
				<div key={value.id}>
					<FormSection
						currentStep={progress}
						componentStep={componentIndex}
						title={`Informações do Responsável ${index + 1}`}
					>
						<div>
							<InputText
								id={`nome-responsavel-${index + 1}`}
								label="Nome:"
								placeholder={`Nome do Responsável ${index + 1}`}
								type="text"
								name={`parents.${index}.name`}
								register={register}
								error={errors.parents?.[index]?.name?.message}
							/>
						</div>
						<div>
							<InputText
								id={`cpf-responsavel-${index + 1}`}
								label="CPF:"
								placeholder={`CPF do Responsável ${index + 1}`}
								type="text"
								name={`parents.${index}.cpf`}
								mask="000.000.000-00"
								control={control}
								error={errors.parents?.[index]?.cpf?.message}
							/>
						</div>
						<div>
							<InputText
								id={`data-nasc-responsavel-${index + 1}`}
								label="Data de Nascimento:"
								placeholder="dd/mm/aaaa"
								type="date"
								name={`parents.${index}.birthdate`}
								register={register}
								error={
									errors.parents?.[index]?.birthdate?.message
								}
							/>
						</div>
						<div>
							<InputText
								id={`rg-responsavel-${index + 1}`}
								label="RG:"
								placeholder={`RG do Responsável ${index + 1}`}
								type="text"
								name={`parents.${index}.rg`}
								register={register}
								error={errors.parents?.[index]?.rg?.message}
							/>
						</div>
						<div>
							<InputText
								id={`telefone-responsavel-${index + 1}`}
								label="Telefone:"
								placeholder={`Telefone do Responsável ${index + 1}`}
								type="text"
								name={`parents.${index}.phone`}
								control={control}
								mask="(00) 00000-0000"
								error={errors.parents?.[index]?.phone?.message}
							/>
						</div>
						<br />
						{index === fields.length - 1 && (
							<Button
								className="bg-primary-600 text-left hover:bg-primary-400"
								onClick={addParent}
								type={"button"}
							>
								<PlusIcon width={18} height={18} />
								&nbsp; Adicionar Outro Responsável
							</Button>
						)}
						{fields.length - 1 > 0 &&
							index === fields.length - 1 && (
								<Button
									className="bg-primary-600 text-left hover:bg-primary-400"
									onClick={removeParent}
									type={"button"}
								>
									<TrashIcon width={18} height={18} />
									&nbsp; Remover responsável
								</Button>
							)}
					</FormSection>
					{index != fields.length - 1 && <br />}
				</div>
			))}
		</>
	);
}
