import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import { useFormContext } from "react-hook-form";
import { CreatePsychologistForm } from "./schema";
import { InputCurrency } from "@/components/form/InputCurrency";

interface PsychologistnfoProps {
	progress: number;
	componentIndex: number;
}

export default function SessionInfoSection({
	progress,
	componentIndex
}: PsychologistnfoProps) {
	const {
		register,
		setValue,
		formState: { errors }
	} = useFormContext<CreatePsychologistForm>();
	return (
		<FormSection
			currentStep={progress}
			componentStep={componentIndex}
			title="Informações da Sessão"
		>
			<>
				<div>
					<InputCurrency
						id="meetValue"
						label="Valor da Sessão em reais:"
						placeholder="R$ 0,00"
						name="meetValue"
						register={register}
						setValue={setValue}
						error={errors.meetValue?.message}
					/>
				</div>
				<div>
					<InputText
						id="meetDuration"
						label="Duração da Sessão em minutos:"
						placeholder="Duração da Sessão"
						type="text"
						name="meetDuration"
						register={register}
						error={errors.meetDuration?.message}
					/>
				</div>
			</>
		</FormSection>
	);
}
