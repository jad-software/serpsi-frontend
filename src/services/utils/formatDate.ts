import moment from "moment";

export function formatDateToddmmYYYY(date: Date) {
	return date ? moment(date).utc(false).format("DD/MM/YYYY") : null;
}

export function formatDateToddmmYYYYHHMM(date: Date) {
	return moment(date).format("DD/MM/YYYY HH:mm");
}

export function formatDateToYYYYmmdd(date: Date) {
	return moment.utc(date).format("YYYY-MM-DDT00:00:00.000z").replace(/\s*(GMT|UTC)$/, "z")
}
