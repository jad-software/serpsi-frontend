import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import { useFormContext } from "react-hook-form";
import { CreatePsychologistForm } from "./schema";

interface PsychologistnfoProps {
	progress: number;
	componentIndex: number;
}

export default function PatientInfoSection({
	progress,
	componentIndex
}: PsychologistnfoProps) {
	const {
		register,
		formState: { errors }
	} = useFormContext<CreatePsychologistForm>();
	return (
		<FormSection
			currentStep={progress}
			componentStep={componentIndex}
			title="Informações do Psicólogo"
		>
			<>
				<div>
					<InputText
						id="nome"
						label="Nome:"
						placeholder="Nome do Psicólogo"
						type="text"
						name="person.name"
						register={register}
						error={errors.person?.name?.message}
					/>
				</div>
				<div>
					<InputText
						id="cpf"
						label="CPF:"
						placeholder="CPF do Psicólogo"
						type="text"
						name="person.cpf"
						mask="999.999.999-99"
						register={register}
						error={errors.person?.cpf?.message}
					/>
				</div>
				<div>
					<InputText
						id="data-nasc"
						label="Data de Nascimento:"
						placeholder="dd/mm/aaaa"
						type="date"
						name="person.birthdate"
						register={register}
						error={errors.person?.birthdate?.message}
					/>
				</div>
				<div>
					<InputText
						id="rg"
						label="RG:"
						placeholder="RG do Psicólogo"
						type="text"
						name="person.rg"
						register={register}
						error={errors.person?.rg?.message}
					/>
				</div>
				<div>
					<InputText
						id="telefone"
						label="Telefone:"
						placeholder="Telefone do Psicólogo"
						type="text"
						name="person.phone"
						mask="(99) 99999-9999"
						register={register}
						error={errors.person?.phone?.message}
					/>
				</div>
			</>
		</FormSection>
	);
}
