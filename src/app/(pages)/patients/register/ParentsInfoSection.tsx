import { ReactNode, useEffect, useState } from "react";
import { FormSection } from "./FormSection";
import { InputText } from "@/components/form/InputText";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { useFieldArray, useFormContext } from "react-hook-form";

interface ParentsInfoProps {
	progress: number;
	componentIndex: number;
}

export default function ParentsInfoSection({
	progress,
	componentIndex
}: ParentsInfoProps) {
	const { control, register } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "parents"
	});

	const addParent = () => {
		append({ name: "", rg: "", birthdate: "", phone: "", cpf: "" });
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
							/>
						</div>
						<div>
							<InputText
								id={`cpf-responsavel-${index + 1}`}
								label="CPF:"
								placeholder={`CPF do Responsável ${index + 1}`}
								type="text"
								name={`parents.${index}.cpf`}
								mask="999.999.999-99"
								register={register}
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
							/>
						</div>
						<div>
							<InputText
								id={`telefone-responsavel-${index + 1}`}
								label="Telefone:"
								placeholder={`Telefone do Responsável ${index + 1}`}
								type="text"
								name={`parents.${index}.phone`}
								register={register}
								mask="(99) 99999-9999"
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
