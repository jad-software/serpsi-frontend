import { z } from "zod";
import {
	validateCPF,
	verifyIfCPFAlreadyExists
} from "@/services/utils/verifyCPF";

// Validations Regex
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cepRegex = /^\d{5}-\d{3}$/;
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

const fileListType =
	typeof window !== "undefined" && typeof FileList !== "undefined"
		? z.instanceof(FileList)
		: z.any();

export const createPatientFormSchema = z
	.object({
		// PatientPictureSection
		profilePicture: fileListType.refine((val) => val && val.length > 0, {
			message: "A foto de perfil é obrigatória.",
			path: ["profilePicture"]
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
				.min(1, "CPF é um campo obrigatório.")
				.refine(validateCPF, {
					message: "CPF inválido."
				})
				.refine(async (cpf) => !(await verifyIfCPFAlreadyExists(cpf)), {
					message: "CPF já cadastrado."
				})
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

		// ParentsInfoSection
		parents: z.array(
			z.object({
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
					.regex(
						cpfRegex,
						"O CPF deve seguir o padrão 000.000.000-00."
					)
			})
		),

		// SchoolInfoSection
		checkSchool: z.boolean(),
		school: z
			.object({
				name: z.string().min(1, "Nome é um campo obrigatório."),
				cnpj: z
					.string()
					.regex(
						cnpjRegex,
						"O CNPJ deve seguir o padrão 00.000.000/0000-00."
					),
				phone: z
					.string()
					.regex(
						phoneRegex,
						"O telefone deve seguir o padrão (00) 00000-0000."
					),
				state: z.string().min(2, "Estado é um campo obrigatório."),
				zipCode: z
					.string()
					.regex(cepRegex, "O CEP deve seguir o padrão 00000-000."),
				street: z.string().min(1, "Rua é um campo obrigatório."),
				district: z.string().min(1, "Bairro é um campo obrigatório."),
				city: z.string().min(1, "Cidade é um campo obrigatório."),
				schoolNumber: z
					.string()
					.min(1, "Número da escola é um campo obrigatório."),
				complement: z.string().optional()
			})
			.optional(),

		// ExtraInfoSection
		comorbidities: z.string().optional(),
		previousDocuments: fileListType.optional(),
		paymentPlan: z.string().min(1, "Plano de pagamento é obrigatório"),
		checkMedicines: z.boolean(),
		medicines: z
			.array(
				z.object({
					name: z
						.string()
						.min(1, "Nome do medicamento é obrigatório"),
					dosage: z.coerce
						.number()
						.positive("A dosagem deve ser maior que zero"),
					dosageUnity: z
						.string()
						.min(1, "Unidade de dosagem é obrigatória"),
					frequency: z.coerce
						.number()
						.positive("A frequência deve ser maior que zero"),
					firstTimeOfTheDay: z
						.string()
						.min(1, "Horário é obrigatório"),
					startDate: z
						.preprocess((val) => {
							return val === "" ? undefined : val;
						}, z.coerce.date().optional())
						.refine((val) => val !== undefined, {
							message: "Data é um campo obrigatório."
						}),
					observation: z.string().optional()
				})
			)
			.optional()
	})
	.refine(
		(data) =>
			!data.checkMedicines ||
			(data.medicines && data.medicines.length > 0),
		{
			message: "Preencha os campos de medicamento.",
			path: ["medicines"]
		}
	)
	.refine(
		(data) =>
			!data.checkSchool ||
			(data.school &&
				Object.values(data.school).some(
					(field) => field !== undefined
				)),
		{
			message: "Preencha os campos da escola.",
			path: ["school"]
		}
	);

export type CreatePatientForm = z.infer<typeof createPatientFormSchema>;

export function formatPatientData(formData: CreatePatientForm): FormData {
	type FormattedDataType = {
		paymentPlan: string;
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
		parents: {
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
		}[];
		comorbidities: {
			name: string;
		}[];
		medicines: {
			medicine: {
				name: string;
			};
			dosage: number;
			dosageUnity: string;
			frequency: number;
			firstTimeOfTheDay: string | null;
			startDate: string;
			observation: string;
		}[];
		school?: {
			name: string | undefined;
			CNPJ: string | undefined;
			address: {
				state: string | undefined;
				zipCode: string | undefined;
				street: string | undefined;
				district: string | undefined;
				city: string | undefined;
				homeNumber: string | undefined;
				complement: string | undefined;
			};
			phone: {
				ddi: string;
				ddd: string | undefined;
				number: string | undefined;
			};
		};
	};

	let formattedData: FormattedDataType = {
		paymentPlan: formData.paymentPlan,
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
		parents: formData.parents.map((parent) => ({
			name: parent.name,
			rg: parent.rg,
			birthdate: parent.birthdate?.toISOString().split("T")[0],
			phone: {
				ddi: "+55",
				ddd: parent.phone.slice(1, 3),
				number: parent.phone.slice(4).replace("-", "")
			},
			cpf: {
				cpf: parent.cpf
			}
		})),

		comorbidities: formData.comorbidities
			? formData.comorbidities.split(",").map((name) => {
					return {
						name: name.trim()
					};
				})
			: [],
		medicines:
			formData.medicines?.map((medicine) => ({
				medicine: {
					name: medicine.name
				},
				dosage: medicine.dosage,
				dosageUnity: medicine.dosageUnity,
				frequency: medicine.frequency,
				firstTimeOfTheDay: convertTimeToISO(medicine.firstTimeOfTheDay),
				startDate: new Date(medicine.startDate).toISOString(),
				observation: medicine.observation || ""
			})) || []
	};

	const formDataObj = new FormData();

	const profPic: FileList = formData.profilePicture;
	const prevDocs: FileList = formData.previousDocuments;

	if (formData.checkSchool === true) {
		formattedData.school = {
			name: formData.school?.name,
			CNPJ: formData.school?.cnpj,
			address: {
				state: formData.school?.state,
				zipCode: formData.school?.zipCode.replace("-", ""),
				street: formData.school?.street,
				district: formData.school?.district,
				city: formData.school?.city,
				homeNumber: formData.school?.schoolNumber,
				complement: formData.school?.complement || ""
			},
			phone: {
				ddi: "+55",
				ddd: formData.school?.phone.slice(1, 3),
				number: formData.school?.phone.slice(4).replace("-", "")
			}
		};
	}
	formDataObj.append("patientData", JSON.stringify(formattedData));
	formDataObj.append("profilePicture", profPic[0]);

	Array.from(prevDocs).forEach((file) => {
		formDataObj.append("documents", file);
	});

	return formDataObj;
}

function convertTimeToISO(time: string): string | null {
	const today = new Date();

	const [hours, minutes] = time.split(":").map(Number);

	today.setHours(hours, minutes, 0, 0);

	return today.toISOString();
}
