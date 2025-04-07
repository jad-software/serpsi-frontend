import moment from "moment";

export function formatDateToddmmYYYY(date: Date) {
	return date ? moment(date).format("DD/MM/YYYY") : null;
}

export function formatDateToddmmYYYYHHMM(date: Date) {
	return moment(date).format("DD/MM/YYYY HH:mm");
}

export function formatHour(date: string) {
	return moment.utc(date).format("HH:mm");
}
