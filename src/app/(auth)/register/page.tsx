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
	formatPatientData
} from "./schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UserInfoSection from "./UserInfoSection";

export default function RegisterNewPatientPage() {
	const [progress, setProgress] = useState<number>(1);
	const router = useRouter();

	const maxProgress = 4;

	// const methods = useForm<CreatePatientForm>({
	// 	resolver: zodResolver(createPatientFormSchema),
	// 	defaultValues: {
	// 		parents: [
	// 			{
	// 				name: "",
	// 				rg: "",
	// 				phone: "",
	// 				cpf: ""
	// 			}
	// 		]
	// 	}
	// });

	const methods = useForm<CreatePsychologistForm>({
		resolver: zodResolver(createPsychologistFormSchema),
		defaultValues: {
			// ParentsInfoSection
			user: {
				email: '',
				password: '',
				role: 'PSI'
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
			console.log('DATA', data);
			const formattedData = formatPatientData(data);
			console.log('formattedData', formattedData);

			// toast.promise(createPatient(formattedData), {
			// 	loading: "Carregando...",
			// 	success: () => {
			// 		router.push("/patients");
			// 		return "Paciente cadastrado com sucesso! 😍";
			// 	},
			// 	error: (err) => {
			// 		console.log(err);
			// 		return "Houve um erro ao cadastrar o paciente.";
			// 	}
			// });

			// console.log("Paciente cadastrado com sucesso:", response);
			// toast.success("Paciente cadastrado com sucesso!");
		} catch (error) {
			toast.error("Houve um erro ao tentar cadastrar paciente.");
			console.error("Erro ao cadastrar paciente:", error);
		}
	};

	const onInvalidSubmit = (data: any) => {
		toast.error(
			"Cadastro inválido! Por favor, verifique os campos preenchidos e tente novamente."
		);
		console.log("Erros de validação:", methods.formState.errors);
		if (methods.formState.errors.profilePicture) {
			toast.error("Por favor, adicione a foto do paciente!");
		}
		console.log("Estado atual do formulário:", methods.watch());
	};

	const advanceProgress = async () => {
		var isValid: boolean = true;
		switch (progress) {
			case 1:
				isValid = await methods.trigger(['user', 'crp'])
				break;
			case 2:
				isValid = await methods.trigger(["person"]);
				break;
			case 3:
				isValid = await methods.trigger(["address"]);
				break;

			default:
				break;
		}
		// Verifica se há erros após a validação
		if (!isValid) {
			console.log("Erros de validação:", methods.formState.errors);
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
						<ExtraInfoSection
							progress={progress}
							componentIndex={4}
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
