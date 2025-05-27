import { z } from "zod";

const fileListType =
  typeof window !== "undefined" && typeof FileList !== "undefined"
    ? z.instanceof(FileList)
    : z.any();

const IdSchema = z.object({ _id: z.string().uuid() });

const PhoneSchema = z.union([
  z.object({
    _ddi: z.string().min(1, "DDI é obrigatório"),
    _ddd: z.string().min(1, "DDD é obrigatório"),
    _number: z.string().min(1, "Número é obrigatório")
  }),
  z.string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido")

]);

const CpfSchema = z.object({ _cpf: z.string().regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/) });

const AddressSchema = z.object({
  _city: z.string(),
  _zipCode: z.string(),
  _street: z.string(),
  _district: z.string(),
  _state: z.string(),
  _homeNumber: z.string(),
  _complement: z.string().optional(),
  _id: z.object({ _id: z.string().uuid() })
});

const PersonSchema = z.object({
  _name: z.string(),
  _rg: z.string(),
  _profilePicture: z.string().url(),
  _birthdate: z.string().date(),
  _id: IdSchema,
  _phone: PhoneSchema,
  _cpf: CpfSchema,
  address: AddressSchema
});

const SchoolSchema = z.object({
  _name: z.string(),
  _id: IdSchema,
  _CNPJ: z.object({ _code: z.string() }),
  _phone: PhoneSchema,
  _address: AddressSchema
}).optional();

const ComorbiditySchema = z.object({
  _name: z.string(),
  _id: IdSchema.optional()
});

const ParentSchema = PersonSchema.omit({ address: true, _profilePicture: true });

const MedicineSchema = z.object({
  _patient_id: z.string().uuid().optional(),
  _medicine_id: z.string().uuid().optional(),
  _medicine: z.object({ _name: z.string().min(1, "Nome é obrigatório"), _id: IdSchema.optional() }),
  _schedules: z.array(z.coerce.date()).optional(),
  _dosage: z.coerce
    .number()
    .positive("A dosagem deve ser maior que zero"),
  _dosageUnity: z
    .string()
    .min(1, "Unidade de dosagem é obrigatória"),
  _frequency: z.coerce
    .number()
    .positive("A frequência deve ser maior que zero"),
  _firstTimeOfTheDay: z
    .string()
    .min(1, "Horário é obrigatório"),
  _startDate: z
    .preprocess((val) => {
      return val === "" ? undefined : val;
    }, z.coerce.date())
    .refine((val) => val !== undefined, {
      message: "Data é um campo obrigatório."
    }),
  _observation: z.string().optional()
});

const PreviewFollowUpSchema = z.object({
  _title: z.string(),
  _docLink: z.string().url(),
  _id: IdSchema,
  _patient: z.object({ _paymentPlan: z.string(), _id: IdSchema })
});

const PatientSchema = z.object({
  picture: fileListType.optional(),
  _paymentPlan: z.string(),
  _id: IdSchema,
  _person: PersonSchema,
  _school: SchoolSchema,
  _comorbidities: z.array(ComorbiditySchema),
  _parents: z.array(ParentSchema),
  _medicines: z.array(MedicineSchema),
  _previewFollowUps: z.array(PreviewFollowUpSchema)
});
export type PatientData = z.infer<typeof PatientSchema>;
export type PersonData = z.infer<typeof PersonSchema>;
export type ParentData = z.infer<typeof ParentSchema>;
export type MedicineData = z.infer<typeof MedicineSchema>;
export type comorbidityData = z.infer<typeof ComorbiditySchema>;

export { PatientSchema };
export {
  IdSchema,
  PhoneSchema,
  CpfSchema,
  AddressSchema,
  PersonSchema,
  SchoolSchema,
  ComorbiditySchema,
  ParentSchema,
  MedicineSchema,
  PreviewFollowUpSchema
};