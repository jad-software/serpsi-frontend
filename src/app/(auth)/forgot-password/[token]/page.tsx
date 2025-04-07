"use client";
import { Button } from "@/components/form/button";
import { InputText } from "@/components/form/input";
import { login } from "@/services/authService";
import { forgotPass, resetPass } from "@/services/passwordService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z, ZodRawShape } from "zod";

const passwordSchema = z
  .object({
    _newPassword: z
      .string()
      .min(8, "A nova senha tem que ter pelo menos 8 caracteres.")
      .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
        message:
          "A senha deve ter pelo menos 8 caracteres e conter uma letra maiúscula, uma letra minúscula e um número."
      }),
    _confirmNewPassword: z.string()
  })
  .refine((data) => data._newPassword === data._confirmNewPassword, {
    message: "As senhas não coincidem.",
    path: ["_confirmNewPassword"]
  });

type ResetPasswordData = z.infer<typeof passwordSchema>;

export default function ResetPassword({ params }: { params: { token: string } }) {
  const token = params.token;
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<ResetPasswordData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange"
  });
  const { register, handleSubmit, formState } = methods;
  const { errors } = formState;


  const onSubmit: SubmitHandler<ResetPasswordData> = async (data: ResetPasswordData) => {
    setLoading(true);

    toast.promise(resetPass(token, data._newPassword, data._confirmNewPassword), {
      loading: "Carregando...",
      success: (result) => {
        setLoading(false);
        return "Senha atualizada com sucesso!";
      },
      error: (result) => {
        setLoading(false);
        return "Erro ao atualizar a senha";
      }
    });
  };

  return (
    <main
      className="flex h-screen w-screen items-center justify-center bg-cover p-5 md:p-10"
      style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
    >
      <section className="flex h-full w-full flex-row items-center justify-around rounded-[30px] border border-primary-500 bg-gradiente-vidro p-9 md:w-4/5">
        <section className="hidden w-2/5 text-primary-950 lg:block">
          <h2 className="text-5xl">
            Gerencie o seu consultório de psicologia
          </h2>
          <p className="mb-4 mt-8 text-2xl">
            Horários, pacientes, documentos,
            <br /> tudo num só lugar.
          </p>
          <Button className="mt-2 p-3 text-sm" text="Saiba mais" />
        </section>
        <section className="w-full text-primary-950 lg:w-2/5">
          <h1 className="mb-8 text-center text-5xl font-medium text-primary-900">
            Redefina sua senha
          </h1>
          <form
            className="flex h-2/5 flex-col justify-around"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputText
              // name="email"
              label="Insira sua nova senha"
              type="password"
              id="newPassword"
              placeholder="Nova Senha"
              {...register("_newPassword")}
              error={errors._newPassword?.message}
            />
            <br />
            <InputText
              // name="email"
              label="Confirme sua nova senha"
              type="password"
              id="confirmNewPassword"
              placeholder="Confirme Nova Senha"
              {...register("_confirmNewPassword")}
              error={errors._confirmNewPassword?.message}
            />
            <br />
            <Button
              text={loading ? "Carregando..." : "Redefinir Senha"}
              variant="second"
              disabled={loading}
              className="pb-1 pt-1 text-xl"
              type="submit"
            />
          </form>
        </section>
      </section>
    </main>
  );
}