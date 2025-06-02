import { Medicine } from "./Medicine";

export interface MedicamentInfo {
  _patient_id: string;
  _medicine_id: string;
  _dosage: number;
  _dosageUnity: string;
  _frequency: number;
  _firstTimeOfTheDay: Date
  _startDate: Date
  _observation: string,
  _medicine: Medicine;
  _schedules: Date[]
}