import { InputText } from "@/components/form/InputText";
import { FormSection } from "./FormSection";
import { Controller, useFormContext } from "react-hook-form";
import { CreatePatientForm } from "./schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { useEffect } from "react";
import { getCEP } from "@/services/cepService";

interface AddressInfoProps {
	progress: number;
	componentIndex: number;
}

export default function AddressInfoSection({
	progress,
	componentIndex
}: AddressInfoProps) {
	const {
		register,
		control,
		watch,
		setValue,
		formState: { errors }
	} = useFormContext<CreatePatientForm>();

	const cep = watch("address.zipCode");

	useEffect(() => {
		const fetchCEP = async (zipCode: string) => {
			if (!zipCode || zipCode.length !== 9) {
				return;
			} else {
				const response = await getCEP(zipCode);
				if (response) {
					setValue("address.city", response.localidade);
					setValue("address.street", response.logradouro);
					setValue("address.state", response.uf);
					setValue("address.district", response.bairro);
					if (response.complemento) {
						setValue("address.complement", response.complemento);
					}
				}
			}
		};
		fetchCEP(cep);
	}, [cep, setValue]);

	return (
		<FormSection
			currentStep={progress}
			componentStep={componentIndex}
			title="Endereço:"
		>
			<>
				<div>
					<InputText
						id="cep"
						label="CEP:"
						placeholder="CEP"
						type="text"
						name="address.zipCode"
						mask="99999-999"
						register={register}
						error={errors.address?.zipCode?.message}
					/>
				</div>
				<div>
					<InputText
						id="cidade"
						label="Cidade:"
						placeholder="Digite a Cidade"
						type="text"
						name="address.city"
						register={register}
						error={errors.address?.city?.message}
					/>
				</div>
				<div>
					<InputText
						id="rua"
						label="Rua:"
						placeholder="Digite a Rua"
						type="text"
						name="address.street"
						register={register}
						error={errors.address?.street?.message}
					/>
				</div>
				<div>
					<label
						className="mb-1 w-full text-sm font-normal text-primary-950"
						htmlFor="address.state"
					>
						Estado:
					</label>

					<Controller
						name="address.state"
						control={control}
						render={({ field }) => (
							<Select
								onValueChange={field.onChange}
								value={field.value}
							>
								<SelectTrigger
									className={
										errors.address?.state
											? "w-full border-red-500 focus:ring-red-600"
											: "w-full border-primary-400 focus:ring-primary-500"
									}
								>
									<SelectValue placeholder="Selecione o estado" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="AC">Acre</SelectItem>
									<SelectItem value="AL">Alagoas</SelectItem>
									<SelectItem value="AP">Amapá</SelectItem>
									<SelectItem value="AM">Amazonas</SelectItem>
									<SelectItem value="BA">Bahia</SelectItem>
									<SelectItem value="CE">Ceará</SelectItem>
									<SelectItem value="DF">
										Distrito Federal
									</SelectItem>
									<SelectItem value="ES">
										Espírito Santo
									</SelectItem>
									<SelectItem value="GO">Goiás</SelectItem>
									<SelectItem value="MA">Maranhão</SelectItem>
									<SelectItem value="MT">
										Mato Grosso
									</SelectItem>
									<SelectItem value="MS">
										Mato Grosso do Sul
									</SelectItem>
									<SelectItem value="MG">
										Minas Gerais
									</SelectItem>
									<SelectItem value="PA">Pará</SelectItem>
									<SelectItem value="PB">Paraíba</SelectItem>
									<SelectItem value="PR">Paraná</SelectItem>
									<SelectItem value="PE">
										Pernambuco
									</SelectItem>
									<SelectItem value="PI">Piauí</SelectItem>
									<SelectItem value="RJ">
										Rio de Janeiro
									</SelectItem>
									<SelectItem value="RN">
										Rio Grande do Norte
									</SelectItem>
									<SelectItem value="RS">
										Rio Grande do Sul
									</SelectItem>
									<SelectItem value="RO">Rondônia</SelectItem>
									<SelectItem value="RR">Roraima</SelectItem>
									<SelectItem value="SC">
										Santa Catarina
									</SelectItem>
									<SelectItem value="SP">
										São Paulo
									</SelectItem>
									<SelectItem value="SE">Sergipe</SelectItem>
									<SelectItem value="TO">
										Tocantins
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.address?.state && (
						<span className="text-sm text-red-400">
							{errors.address?.state?.message}
						</span>
					)}
				</div>
				<div>
					<InputText
						id="bairro"
						label="Bairro:"
						placeholder="Digite o Bairro"
						type="text"
						name="address.district"
						register={register}
						error={errors.address?.district?.message}
					/>
				</div>
				<div>
					<InputText
						id="numero"
						label="Número:"
						placeholder="Digite o Número da Residência"
						type="text"
						name="address.homeNumber"
						register={register}
						error={errors.address?.homeNumber?.message}
					/>
				</div>
				<div>
					<InputText
						id="Complemento"
						label="Complemento:"
						placeholder="Digite o Complemento"
						type="text"
						name="address.complement"
						register={register}
						error={errors.address?.complement?.message}
					/>
				</div>
			</>
		</FormSection>
	);
}
