import { EntityBase } from "..";
import { Address } from "./Address";
import { Phone } from "../vos/Phone";
import { CNPJ } from "../vos/CNPJ";

export interface School extends EntityBase {
	_name: string;
	_CNPJ: CNPJ;
	_address: Address;
	_phone: Phone;
}
