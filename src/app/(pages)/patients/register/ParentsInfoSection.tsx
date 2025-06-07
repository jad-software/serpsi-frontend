import { FormSection } from "./FormSection";
import { InputText } from "@/components/form/InputText";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface ParentsInfoProps {
	progress: number;
	componentIndex: number;
	underage: boolean;
}

type ParentsInfoForm = {
	checkParents: boolean;
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
	componentIndex,
	underage
}: ParentsInfoProps) {
	const {
		control,
		register,
		watch,
		unregister,
		formState: { errors }
	} = useFormContext<ParentsInfoForm>();

	const checkParents = watch("checkParents");

	useEffect(() => {
		if (!checkParents) {
			unregister("parents");
		}
	}, [checkParents, unregister]);

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
			<FormSection
				currentStep={progress}
				componentStep={componentIndex}
				title={`Informações do Responsável`}
			>
				<div className="flex w-full items-center justify-start md:col-span-2">
					<input
						className="mr-2 h-4 w-4 accent-primary-600"
						id="checkParents"
						type="checkbox"
						disabled={underage}
						{...register("checkParents")}
					/>
					<label htmlFor="checkParents">
						Incluir Informações dos Responsáveis.
					</label>
				</div>
			</FormSection>

			{checkParents &&
				fields.map((value, index) => (
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
									error={
										errors.parents?.[index]?.name?.message
									}
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
									error={
										errors.parents?.[index]?.cpf?.message
									}
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
										errors.parents?.[index]?.birthdate
											?.message
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
									register={register}
									mask="(99) 99999-9999"
									error={
										errors.parents?.[index]?.phone?.message
									}
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
