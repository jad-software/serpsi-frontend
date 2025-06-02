import { EntityBase } from "..";
import { School } from "./School";
import { MedicamentInfo } from "./MedicamentInfo";
import { Comorbidity } from "./Comorbidity";
import { PaymentPlan } from "../vos/PaymentPlan";
import { Person } from "./Person";
import { Document } from "./Document";

export interface Patient extends EntityBase {
	_paymentPlan: PaymentPlan;
	_school: School;
	_comorbidities: Comorbidity[];
	_medicines: MedicamentInfo[];
	_person: Person;
	_parents: Person[];
	_previewFollowUps?: Document[];
}
