export const enum dayTypes {
	Sunday = "Dom.",
	Monday = "Seg.",
	Tuesday = "Ter.",
	Wednesday = "Qua.",
	Thursday = "Qui.",
	Friday = "Sex.",
	Saturday = "Sab."
}

export enum dayTypesResolve {
	Sunday = "DOMINGO",
	Monday = "SEGUNDA",
	Tuesday = "TERCA",
	Wednesday = "QUARTA",
	Thursday = "QUINTA",
	Friday = "SEXTA",
	Saturday = "SABADO"
}

export type AvaliableTime = {
	key: number;
	_startTime: string;
	_endTime: string;
};
export type Agenda = {
	key: number;
	_day: string;
	_avaliableTimes: AvaliableTime[];
};

export type ScheduleAgendas = {
	psychologistId: string;
	meetValue: number;
	meetDuration: number;
	agendas: Agenda[];
};

export const week = [
	{
		key: 0,
		name: dayTypesResolve.Sunday,
		label: dayTypes.Sunday,
		checked: false
	},
	{
		key: 1,
		name: dayTypesResolve.Monday,
		label: dayTypes.Monday,
		checked: true
	},
	{
		key: 2,
		name: dayTypesResolve.Tuesday,
		label: dayTypes.Tuesday,
		checked: true
	},
	{
		key: 3,
		name: dayTypesResolve.Wednesday,
		label: dayTypes.Wednesday,
		checked: true
	},
	{
		key: 4,
		name: dayTypesResolve.Thursday,
		label: dayTypes.Thursday,
		checked: true
	},
	{
		key: 5,
		name: dayTypesResolve.Friday,
		label: dayTypes.Friday,
		checked: true
	},
	{
		key: 6,
		name: dayTypesResolve.Saturday,
		label: dayTypes.Saturday,
		checked: false
	}
];
