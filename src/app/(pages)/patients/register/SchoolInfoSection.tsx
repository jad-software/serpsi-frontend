import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import { Controller, useFormContext } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { CreatePatientForm } from "./schema";
import { useEffect, useState } from "react";
import { getCEP } from "@/services/cepService";
import { getSchool } from "@/services/schoolService";
import { formatPhone } from "@/services/utils/formatPhone";

interface SchoolInfoProps {
	progress: number;
	componentIndex: number;
}

export default function SchoolInfoSection({
	progress,
	componentIndex
}: SchoolInfoProps) {
	const {
		control,
		unregister,
		register,
		watch,
		setValue,
		formState: { errors }
	} = useFormContext<CreatePatientForm>();

	const checkSchool = watch("checkSchool");
	const [zipCodeChanged, setZipCodeChanged] = useState(false);

	useEffect(() => {
		if (!checkSchool) {
			unregister("school");
		}
	}, [checkSchool, unregister]);

	const cep = watch("school.zipCode");
	const nome = watch("school.name");

	useEffect(() => {
		const fetchSchool = async (nome: string) => {
			if (!nome) {
				return;
			}

			try {
				const response = await getSchool({ nome, cnpj: undefined });
				if (response) {
					setValue("school.name", response._name);
					setValue("school.cnpj", response._CNPJ._code);
					setValue(
						"school.zipCode",
						response._address._zipCode.slice(0, 5) +
							"-" +
							response._address._zipCode.slice(5)
					);
					setZipCodeChanged(true);
					setValue("school.city", response._address._city);
					setValue("school.street", response._address._street);
					setValue("school.state", response._address._state);
					setValue("school.district", response._address._district);
					setValue(
						"school.schoolNumber",
						response._address._homeNumber
					);
					setValue(
						"school.phone",
						formatPhone(response._phone, false),
						{ shouldValidate: false }
					);
					if (response._address._complement) {
						setValue(
							"school.complement",
							response._address._complement
						);
					}
				}
			} catch (error) {
				console.error("Error fetching school:", error);
			}
		};

		// Create separate effects for nome/cnpj and cep
		const debouncedSchoolSearch = setTimeout(() => {
			if (nome) {
				fetchSchool(nome);
			}
		}, 1500);

		// Handle CEP search separately without debounce

		// Cleanup function
		return () => {
			clearTimeout(debouncedSchoolSearch);
		};
	}, [nome, setValue]); // Only depend on nome and cnpj for school search

	// Separate useEffect for CEP
	useEffect(() => {
		const fetchCEP = async (zipCode: string) => {
			if (!zipCode || zipCode.length !== 9) {
				return;
			}

			try {
				const response = await getCEP(zipCode);
				if (response) {
					setValue("school.city", response.localidade);
					setValue("school.street", response.logradouro);
					setValue("school.state", response.uf);
					setValue("school.district", response.bairro);
					if (response.complemento) {
						setValue("school.complement", response.complemento);
					}
				}
			} catch (error) {
				console.error("Error fetching CEP:", error);
			}
		};
		const fetchCEPData = async () => {
			if (!zipCodeChanged && cep) {
				await fetchCEP(cep);
			}
		};

		fetchCEPData();
	}, [cep, zipCodeChanged, setValue]); // Separate dependencies for CEP

	return (
		<>
			<FormSection
				currentStep={progress}
				componentStep={componentIndex}
				title="Escola:"
			>
				<div className="flex w-full items-center justify-start md:col-span-2">
					<input
						className="mr-2 h-4 w-4 accent-primary-600"
						id="checkSchool"
						type="checkbox"
						{...register("checkSchool")}
					/>
					<label htmlFor="checkSchool">Paciente é estudante.</label>
				</div>
				{checkSchool && (
					<>
						<div>
							<InputText
								id="nome-escola"
								label="Nome:"
								placeholder="Nome da Escola"
								type="text"
								name="school.name"
								register={register}
								error={errors.school?.name?.message}
							/>
						</div>
						<div>
							<InputText
								id="cnpj-escola"
								label="CNPJ:"
								placeholder="CNPJ da Escola"
								type="text"
								name="school.cnpj"
								register={register}
								mask="99.999.999/9999-99"
								error={errors.school?.cnpj?.message}
							/>
						</div>
						<div>
							<InputText
								id="cep-escola"
								label="CEP:"
								placeholder="CEP da Escola"
								type="text"
								name="school.zipCode"
								register={register}
								mask="99999-999"
								error={errors.school?.zipCode?.message}
							/>
						</div>
						<div>
							<InputText
								id="cidade-escola"
								label="Cidade:"
								placeholder="Cidade da Escola"
								type="text"
								name="school.city"
								register={register}
								error={errors.school?.city?.message}
							/>
						</div>
						<div>
							<InputText
								id="rua-escola"
								label="Rua:"
								placeholder="Rua da Escola"
								type="text"
								name="school.street"
								register={register}
								error={errors.school?.street?.message}
							/>
						</div>
						<div>
							<label
								className="mb-1 w-full text-sm font-normal text-primary-950"
								htmlFor="school.state"
							>
								Estado:
							</label>
							<Controller
								name="school.state"
								control={control}
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger
											className={
												errors.school?.state
													? "w-full border-red-500 focus:ring-red-600"
													: "w-full border-primary-400 focus:ring-primary-500"
											}
										>
											<SelectValue placeholder="Selecione o estado" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="AC">
												Acre
											</SelectItem>
											<SelectItem value="AL">
												Alagoas
											</SelectItem>
											<SelectItem value="AP">
												Amapá
											</SelectItem>
											<SelectItem value="AM">
												Amazonas
											</SelectItem>
											<SelectItem value="BA">
												Bahia
											</SelectItem>
											<SelectItem value="CE">
												Ceará
											</SelectItem>
											<SelectItem value="DF">
												Distrito Federal
											</SelectItem>
											<SelectItem value="ES">
												Espírito Santo
											</SelectItem>
											<SelectItem value="GO">
												Goiás
											</SelectItem>
											<SelectItem value="MA">
												Maranhão
											</SelectItem>
											<SelectItem value="MT">
												Mato Grosso
											</SelectItem>
											<SelectItem value="MS">
												Mato Grosso do Sul
											</SelectItem>
											<SelectItem value="MG">
												Minas Gerais
											</SelectItem>
											<SelectItem value="PA">
												Pará
											</SelectItem>
											<SelectItem value="PB">
												Paraíba
											</SelectItem>
											<SelectItem value="PR">
												Paraná
											</SelectItem>
											<SelectItem value="PE">
												Pernambuco
											</SelectItem>
											<SelectItem value="PI">
												Piauí
											</SelectItem>
											<SelectItem value="RJ">
												Rio de Janeiro
											</SelectItem>
											<SelectItem value="RN">
												Rio Grande do Norte
											</SelectItem>
											<SelectItem value="RS">
												Rio Grande do Sul
											</SelectItem>
											<SelectItem value="RO">
												Rondônia
											</SelectItem>
											<SelectItem value="RR">
												Roraima
											</SelectItem>
											<SelectItem value="SC">
												Santa Catarina
											</SelectItem>
											<SelectItem value="SP">
												São Paulo
											</SelectItem>
											<SelectItem value="SE">
												Sergipe
											</SelectItem>
											<SelectItem value="TO">
												Tocantins
											</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.school?.state && (
								<span className="text-sm text-red-400">
									{errors.school?.state?.message}
								</span>
							)}
						</div>
						<div>
							<InputText
								id="bairro-escola"
								label="Bairro:"
								placeholder="Bairro da Escola"
								type="text"
								name="school.district"
								register={register}
								error={errors.school?.district?.message}
							/>
						</div>
						<div>
							<InputText
								id="numero-escola"
								label="Número:"
								placeholder="Número da Escola"
								type="text"
								name="school.schoolNumber"
								register={register}
								error={errors.school?.schoolNumber?.message}
							/>
						</div>
						<div>
							<InputText
								id="complemento-escola"
								label="Complemento:"
								placeholder="Complemento da Escola"
								type="text"
								name="school.complement"
								register={register}
								error={errors.school?.complement?.message}
							/>
						</div>
						<div>
							<InputText
								id="telefone-escola"
								label="Telefone:"
								placeholder="Telefone da Escola"
								type="text"
								name="school.phone"
								register={register}
								mask="(99) 99999-9999"
								error={errors.school?.phone?.message}
							/>
						</div>
					</>
				)}
			</FormSection>
		</>
	);
}
