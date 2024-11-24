import moment from "moment";

export function formatDateToddmmYYYY(date: Date) {
	return date? moment(date).format("DD/MM/YYYY") : null;
}
