import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import { useFormContext } from "react-hook-form";
import { CreatePsychologistForm } from "./schema";

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
          <InputText
            id="meetValue"
            label="Valor da Sessão em reais:"
            placeholder="Valor da Sessão"
            type="text"
            name="meetValue"
            register={register}
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
