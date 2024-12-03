import moment from "moment";

export function formatDateToddmmYYYY(date: Date) {
	return date ? moment(date).utc(false).format("DD/MM/YYYY") : null;
}

export function formatDateToddmmYYYYHHMM(date: Date) {
	return moment(date).format("DD/MM/YYYY HH:mm");
}
