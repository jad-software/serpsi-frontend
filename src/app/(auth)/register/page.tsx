"use client";
import { ProgressBar } from "@/components/progressBar/progress-bar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import PatientInfoSection from "./PsychologyInfoSection";
import AddressInfoSection from "./AddressInfoSection";
import ExtraInfoSection from "./ExtraInfoSection";
import PatientPictureSection from "./PsychologyPictureSection";

import { zodResolver } from "@hookform/resolvers/zod";
import { createPatient } from "@/services/patientsService";
import {
	CreatePsychologistForm,
	createPsychologistFormSchema,
	formatPsychologistData
} from "./schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UserInfoSection from "./UserInfoSection";
import { createPsychologist } from "@/services/authService";
import SessionInfoSection from "./sessionInfoSection";

export default function RegisterNewPatientPage() {
	const [progress, setProgress] = useState<number>(1);
	const router = useRouter();

	const maxProgress = 5;

	const methods = useForm<CreatePsychologistForm>({
		resolver: zodResolver(createPsychologistFormSchema),
		defaultValues: {
			user: {
				email: "",
				password: "",
				role: "PSI"
			}
		}
	});

	const { clearErrors, watch } = methods;

	// Monitor changes in form fields and clear errors on changes
	watch((_, { name }) => {
		if (name) {
			clearErrors(name);
		}
	});

	const onSubmit = async (data: CreatePsychologistForm) => {
		try {
			const formattedData = formatPsychologistData(data);
			toast.promise(createPsychologist(formattedData), {
				loading: "Carregando...",
				success: () => {
					router.push("/login");
					return "Cadastrado realizado com sucesso! 😍";
				},
				error: (err) => {
					if (err.message.includes("isStrongPassword")) {
						return "Senha muito fraca. Por favor, escolha uma senha mais forte.";
					}

					if (err.message.includes("duplicate key")) {
						if (
							err.message.includes(
								"UQ_502a8c2603ea409c5cff16695d6"
							)
						) {
							return "CRP informado já existe no sistema. Por favor, entre em contato com o Suporte.";
						} else if (
							err.message.includes(
								"UQ_e12875dfb3b1d92d7d7c5377e22"
							)
						) {
							return "E-mail informado já existe no sistema. Por favor, utilize outro e-mail ou entre em contato com o Suporte.";
						} else if (
							err.message.includes(
								"UQ_264b7cad2330569e0ef5b4c39c4"
							)
						) {
							return "CPF informado já existe no sistema. Por favor, entre em contato com o Suporte.";
						} else if (
							err.message.includes(
								"UQ_690554d08986f72266f0f0ff79d"
							)
						) {
							return "RG informado já existe no sistema. Por favor, entre em contato com o Suporte.";
						}
						return "Algum dos dados informados já existem no sistema. Por favor, entre em contato com o Suporte.";
					}
					return "Houve um erro ao realizar o cadastro. Por favor entre em contato com o Suporte.";
				}
			});
		} catch (error) {
			toast.error("Houve um erro ao tentar cadastrar paciente.");
		}
	};

	const onInvalidSubmit = (data: any) => {
		toast.error(
			"Cadastro inválido! Por favor, verifique os campos preenchidos e tente novamente."
		);
		if (methods.formState.errors.profilePicture) {
			toast.error("Por favor, adicione sua foto de perfil!");
		}
	};

	const advanceProgress = async () => {
		var isValid: boolean = true;
		switch (progress) {
			case 1:
				isValid = await methods.trigger(["user", "crp"]);
				break;
			case 2:
				isValid = await methods.trigger(["person"]);
				break;
			case 3:
				isValid = await methods.trigger(["address"]);
				break;
			case 4:
				isValid = await methods.trigger(["meetValue", "meetDuration"]);
				break;

			default:
				break;
		}
		// Verifica se há erros após a validação
		if (!isValid) {
			toast.warning("Preencha os dados obrigatórios corretamente!");
			return;
		}

		setProgress((prev) => prev + 1);
	};

	const regressProgress = () => {
		setProgress((prev) => prev - 1);
	};

	return (
		<main className="mt-3 flex h-full w-full items-center justify-center bg-white px-5 pb-12 md:px-10">
			<section className="flex w-3/4 flex-col items-center gap-5">
				<h1>Cadastrar Novo Psicólogo</h1>
				<FormProvider {...methods}>
					<form
						onSubmit={methods.handleSubmit(
							onSubmit,
							onInvalidSubmit
						)}
						className="w-full"
					>
						<PatientPictureSection />
						<ProgressBar
							steps={maxProgress}
							currentStep={progress}
							className="my-3 w-full"
						/>
						<UserInfoSection
							progress={progress}
							componentIndex={1}
						/>
						<PatientInfoSection
							progress={progress}
							componentIndex={2}
						/>
						<AddressInfoSection
							progress={progress}
							componentIndex={3}
						/>
						<SessionInfoSection
							progress={progress}
							componentIndex={4}
						/>
						<ExtraInfoSection
							progress={progress}
							componentIndex={5}
						/>

						<div className="mt-6 flex w-full flex-col-reverse items-center justify-around px-20 md:flex-row">
							{progress > 1 && (
								<Button
									onClick={regressProgress}
									className="mt-4 w-24 bg-primary-600 hover:bg-primary-400 md:mt-0"
									type={"button"}
								>
									Voltar
								</Button>
							)}
							{progress === maxProgress && (
								<Button
									type="submit"
									className="rounded-lg bg-primary-600 text-white hover:bg-primary-400"
								>
									Cadastrar Psicólogo
								</Button>
							)}

							{progress < maxProgress && (
								<Button
									onClick={advanceProgress}
									className="w-24 bg-primary-600 hover:bg-primary-400"
									type={"button"}
								>
									Próximo
								</Button>
							)}
						</div>
					</form>
				</FormProvider>
			</section>
		</main>
	);
}
