import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import { useFormContext } from "react-hook-form";
import { CreatePatientForm } from "./schema";

interface PacientInfoProps {
	progress: number;
	componentIndex: number;
}

export default function PatientInfoSection({
	progress,
	componentIndex
}: PacientInfoProps) {
	const {
		register,
		formState: { errors }
	} = useFormContext<CreatePatientForm>();
	return (
		<FormSection
			currentStep={progress}
			componentStep={componentIndex}
			title="Informações do Paciente"
		>
			<>
				<div>
					<InputText
						id="nome"
						label="Nome:"
						placeholder="Nome do Paciente"
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
						placeholder="CPF do Paciente"
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
						placeholder="RG do Paciente"
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
						placeholder="Telefone do Paciente"
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
