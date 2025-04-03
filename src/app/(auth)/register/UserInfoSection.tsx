import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import { useFormContext } from "react-hook-form";
import { CreatePsychologistForm } from "./schema";

interface PsychologistnfoProps {
  progress: number;
  componentIndex: number;
}

export default function UserInfoSection({
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
      title="Informações da Conta"
    >
      <>
        <div>
          <InputText
            id="email"
            label="E-mail:"
            placeholder="E-mail do Psicólogo"
            type="text"
            name="user.email"
            register={register}
            error={errors.user?.email?.message}
          />
        </div>
        <div>
          <InputText
            id="password"
            label="Senha:"
            placeholder="Senha do Psicólogo"
            type="password"
            name="user.password"
            register={register}
            error={errors.user?.password?.message}
          />
        </div>
        <div>
          <InputText
            id="crp"
            label="CRP:"
            placeholder="CRP do Psicólogo"
            type="text"
            name="crp.crp"
            mask="99/999999"
            maskPlaceholder=""
            register={register}
            error={errors.crp?.crp?.message}
          />
        </div>
      </>
    </FormSection>
  );
}
