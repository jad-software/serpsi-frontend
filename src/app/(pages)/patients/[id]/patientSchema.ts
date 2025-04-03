import { z } from "zod";

const fileListType =
  typeof window !== "undefined" && typeof FileList !== "undefined"
    ? z.instanceof(FileList)
    : z.any();

const IdSchema = z.object({ _id: z.string().uuid() });

const PhoneSchema = z.object({
  _ddi: z.string(),
  _ddd: z.string(),
  _number: z.string()
});

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
  _birthdate: z.coerce.date(),
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
});

const ComorbiditySchema = z.object({
  _name: z.string(),
  _id: IdSchema
});

const ParentSchema = PersonSchema.omit({ address: true });

const MedicineSchema = z.object({
  _patient_id: z.string().uuid(),
  _medicine_id: z.string().uuid(),
  _dosage: z.number(),
  _dosageUnity: z.string(),
  _frequency: z.number(),
  _firstTimeOfTheDay: z.string().datetime(),
  _startDate: z.string().datetime(),
  _observation: z.string(),
  _medicine: z.object({ _name: z.string(), _id: IdSchema }),
  _schedules: z.array(z.string().datetime())
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