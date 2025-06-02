"use client";
import { Button } from "@/components/form/button";
import { InputText } from "@/components/form/input";
import { login } from "@/services/authService";
import { forgotPass } from "@/services/passwordService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z, ZodRawShape } from "zod";

const forgotPasswordSchema = z.object({
	_email: z
		.string()
		.min(1, "E-mail é requerido")
		.email("Informe um e-mail valido")
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
	const [loading, setLoading] = useState<boolean>(false);
	const methods = useForm<ForgotPasswordData>({
		resolver: zodResolver(forgotPasswordSchema),
		mode: "onChange"
	});
	const { register, handleSubmit, formState } = methods;
	const { errors } = formState;

	const onSubmit: SubmitHandler<ForgotPasswordData> = async (
		data: ForgotPasswordData
	) => {
		setLoading(true);
		toast.promise(forgotPass(data._email), {
			loading: "Carregando...",
			success: (result) => {
				setLoading(false);
				return "Verifique seu E-mail para continuar com a recuperação";
			},
			error: (result) => {
				setLoading(false);
				return "Erro ao enviar o E-mail, verifique se o E-mail está correto";
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
						Recuperar senha
					</h1>
					<form
						className="flex h-2/5 flex-col justify-around"
						onSubmit={handleSubmit(onSubmit)}
					>
						<InputText
							id="email"
							label="Insira seu E-mail"
							type="text"
							placeholder="Email"
							{...register("_email")}
							error={errors._email?.message}
						/>
						<br />

						<Button
							text={loading ? "Carregando..." : "Recuperar"}
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
