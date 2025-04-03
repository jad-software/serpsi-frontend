import { number, z } from "zod";

// Validations Regex
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cepRegex = /^\d{5}-\d{3}$/;
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

const fileListType =
	typeof window !== "undefined" && typeof FileList !== "undefined"
		? z.instanceof(FileList)
		: z.any();

export const createPsychologistFormSchema = z
	.object({
		profilePicture: fileListType.refine((val) => val && val.length > 0, {
			message: "A foto de perfil é obrigatória.",
			path: ["profilePicture"]
		}),
		crp: z.object({

			crp: z.string().refine((val) => /^\d{2}\/\d{5,6}$/.test(val.trim()), {
				message: "CRP inválido. O formato deve ser XX/XXXXX ou XX/XXXXXX.",
			}),
		}),
		user: z.object({
			email: z.string().min(1, 'E-mail é um campo obrigatório').email('Insira um E-mail válido'),
			password: z
				.string()
				.min(8, "A nova senha tem que ter pelo menos 8 caracteres.")
				.regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
					message:
						"A senha deve ter pelo menos 8 caracteres e conter uma letra maiúscula, uma letra minúscula e um número."
				}),
			role: z.string().min(1, 'Role é obrigátorio')
		}),
		// PatientInfoSection
		person: z.object({
			name: z.string().min(1, "Nome é um campo obrigatório."),
			rg: z.string().min(1, "RG é um campo obrigatório."),
			birthdate: z
				.preprocess((val) => {
					return val === "" ? undefined : val;
				}, z.coerce.date().optional())
				.refine((val) => val !== undefined, {
					message: "Data de nascimento é obrigatória."
				}),
			phone: z
				.string()
				.regex(
					phoneRegex,
					"O telefone deve seguir o padrão (00) 00000-0000."
				),
			cpf: z
				.string()
				.regex(cpfRegex, "O CPF deve seguir o padrão 000.000.000-00.")
		}),

		// AddressInfoSection
		address: z.object({
			state: z
				.string()
				.min(2, "Estado é um campo obrigatório.")
				.max(2, "Estado deve ter exatamente 2 caracteres.")
				.transform((val) => val.toUpperCase()),
			zipCode: z
				.string()
				.regex(cepRegex, "O CEP deve seguir o padrão 00000-000."),
			street: z.string().min(1, "Rua é um campo obrigatório."),
			district: z.string().min(1, "Bairro é um campo obrigatório."),
			city: z.string().min(1, "Cidade é um campo obrigatório."),
			homeNumber: z
				.string()
				.min(1, "Número residencial é um campo obrigatório."),
			complement: z.string().optional()
		}),

		// ExtraInfoSection
		meetValue: z
			.string()
			.min(
				1,
				"O valor da sessão é obrigatório"
			).refine(
				(value) => {
					const numericValue = parseFloat(value.replace(/[^\d]/g, "")) / 100;
					return numericValue > 0;
				},
				{
					message: "O valor da sessão deve ser maior que R$ 0",
				}
			),
		meetDuration: z
			.string()
			.min(
				1,
				"O valor da sessão é obrigatório"
			).refine(
				(value) => {
					if (parseFloat(value) > 0) {

						const numericValue = parseFloat(value.replace(/[^\d]/g, "")) / 100;
						return numericValue > 0;
					}
				},
				{
					message: "A duração da sessão deve ser maior que 0",
				}
			),

		crpFile: fileListType.refine((val) => val && val.length > 0, {
			message: "o arquivo do CRP é obrigatório.",
			path: ["crpFile"]
		}),

		identifyfile: fileListType.refine((val) => val && val.length > 0, {
			message: "o arquivo da identidade é obrigatório.",
			path: ["identifyfile"]
		}),
		degreeFile: fileListType.refine((val) => val && val.length > 0, {
			message: "o arquivo da identidade é obrigatório.",
			path: ["degreeFile"]
		}),
	})


export type CreatePsychologistForm = z.infer<typeof createPsychologistFormSchema>;

export function formatPsychologistData(formData: CreatePsychologistForm): FormData {
	type FormattedDataType = {
		crp: {
			crp: string;
		},
		user: {
			email: string;
			password: string;
			role: string;
		},
		person: {
			name: string;
			rg: string;
			birthdate: string;
			phone: {
				ddi: string;
				ddd: string;
				number: string;
			};
			cpf: {
				cpf: string;
			};
			address: {
				state: string;
				zipCode: string;
				street: string;
				district: string;
				city: string;
				homeNumber: string;
				complement: string;
			};
		};
		meetValue: number;
		meetDuration: number;
	};

	let formattedData: FormattedDataType = {

		crp: {
			crp: formData.crp.crp,
		},

		user: {
			email: formData.user.email,
			password: formData.user.password,
			role: formData.user.role
		},
		person: {
			name: formData.person.name,
			rg: formData.person.rg,
			birthdate: formData.person.birthdate?.toISOString().split("T")[0],
			phone: {
				ddi: "+55",
				ddd: formData.person.phone.slice(1, 3),
				number: formData.person.phone.slice(4).replace("-", "")
			},
			cpf: {
				cpf: formData.person.cpf
			},
			address: {
				state: formData.address.state,
				zipCode: formData.address.zipCode.replace("-", ""),
				street: formData.address.street,
				district: formData.address.district,
				city: formData.address.city,
				homeNumber: formData.address.homeNumber,
				complement: formData.address.complement || ""
			}
		},
		meetDuration: +formData.meetDuration,
		meetValue: +(formData.meetValue.replace(/R\$\s?/, '').replace('.', '').replace(',', '.')),
	};

	const formDataObj = new FormData();
	const profPic: FileList = formData.profilePicture;
	const crpFile: FileList = formData.crpFile;
	const identifyfile: FileList = formData.identifyfile;
	const degreeFile: FileList = formData.degreeFile;

	formDataObj.append("psychologistData", JSON.stringify(formattedData));
	formDataObj.append("profilePicture", profPic[0]);
	formDataObj.append('crpFile', crpFile[0]);
	formDataObj.append('identifyfile', identifyfile[0]);
	formDataObj.append('degreeFile', degreeFile[0]);

	return formDataObj;
}

function convertTimeToISO(time: string): string | null {
	const today = new Date();

	const [hours, minutes] = time.split(":").map(Number);

	today.setHours(hours, minutes, 0, 0);

	return today.toISOString();
}
