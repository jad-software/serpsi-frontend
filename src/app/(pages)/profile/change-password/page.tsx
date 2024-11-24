"use client";
import { Input } from "@/components/ui/input";
import { Square } from "../../patients/[id]/Square";
import { InputText } from "@/components/form/input";

import { Button } from "@/components/form/button";
import Link from "next/link";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { z, ZodRawShape } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { changePassword } from "@/services/profileService";
import { useRouter } from "next/navigation";
import { useState } from "react";

const passwordSchema = z
	.object({
		_password: z.string().min(1, "Senha é requerida."),
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

type PasswordData = z.infer<typeof passwordSchema>;

export default function ChangePass() {
	const [loading, setLoading] = useState<boolean>(false);

	const methods = useForm<PasswordData>({
		resolver: zodResolver(passwordSchema),
		mode: "onChange"
	});
	const { register, handleSubmit, formState } = methods;
	const { errors } = formState;

	const router = useRouter();

	const onSubmit: SubmitHandler<PasswordData> = async (data) => {
		setLoading(true);

		toast.promise(changePassword(data), {
			loading: "Carregando...",
			success: (response) => {
				setLoading(false);
				router.push("/profile/");
				return "Senha atualizada com sucesso!";
			},
			error: (error) => {
				setLoading(false);
				return "Algo inesperado aconteceu.";
			}
		});
	};

	return (
		<FormProvider {...methods}>
			<main className="flex flex-col items-center justify-center bg-cover px-10 py-5">
				<div className="mb-2 flex w-full">
					<Link href={"/profile"} className="flex">
						<ChevronLeftIcon
							width={24}
							height={24}
							className="text-gray-500"
						/>
						&nbsp;
						<span className="text-gray-900">Meu perfil</span>
					</Link>
				</div>
				<section className="mt-12 w-full md:w-[50vw]">
					<Square>
						<h1 className="mb-4 text-xl font-medium text-primary-700">
							Mude sua senha
						</h1>
						<form onSubmit={handleSubmit(onSubmit)}>
							<InputText
								{...register("_password")}
								type="password"
								label="Senha Atual:"
								id="password"
								placeholder="Senha"
							/>
							{errors._password && (
								<p className="mb-2 text-sm text-red-500">
									{errors._password.message}
								</p>
							)}
							<InputText
								{...register("_newPassword")}
								type="password"
								label="Senha Nova:"
								id="newPassword"
								placeholder="Nova senha"
							/>
							{errors._newPassword && (
								<p className="mb-2 text-sm text-red-500">
									{errors._newPassword.message}
								</p>
							)}
							<InputText
								{...register("_confirmNewPassword")}
								type="password"
								label="Confirme a senha nova:"
								id="confirmNewPassword"
								placeholder="Confirme nova senha"
							/>
							{errors._confirmNewPassword && (
								<p className="ext-wrap text-sm text-red-500">
									{errors._confirmNewPassword.message}
								</p>
							)}
							<Button
								text={loading ? "Caregando..." : "Salvar"}
								variant="default"
								className="mt-3 pb-1 pt-1 text-xl"
								type="submit"
								disabled={loading}
							/>
						</form>
					</Square>
				</section>
			</main>
		</FormProvider>
	);
}
