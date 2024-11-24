export function formatPhone(
	phone: {
		_ddi: string;
		_ddd: string;
		_number: string;
	},
	needDDI = true
) {
	phone._number = phone._number.trim();
	if (needDDI) return `${phone._ddi} (${phone._ddd}) ${phone._number}`;
	return `(${phone._ddd}) ${phone._number.slice(0, 5)}-${phone._number.slice(5)}`;
}
