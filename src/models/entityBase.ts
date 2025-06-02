import { Id } from "./vos/Id";

export interface EntityBase {
	_id: Id;

	_createDate: Date;

	_updateDate: Date;
}
