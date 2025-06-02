import { EntityBase } from "../entityBase";
import { Patient } from "./Patient";

export interface Document extends EntityBase {
	_title: string;
	_docLink: string;
	_patient: Patient;
}
