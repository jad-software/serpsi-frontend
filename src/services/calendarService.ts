"use server";
import { cookies } from "next/headers";

type DaySession = {
	day: number;
	existsSession: boolean;
};

export type MonthSessions = DaySession[];

export async function getBusyDays(
	month: number,
	year: number
): Promise<MonthSessions> {
	const jwt = cookies().get("Authorization")?.value;
	if (jwt) {
		const response = await fetch(
			process.env.BACKEND_URL +
				"/meetings/busydays?month=" +
				month +
				"&year=" +
				year,
			{
				method: "GET",
				headers: {
					Authorization: jwt
				}
			}
		);
		if (!response.ok) {
			throw new Error("Falhou ao receber dias com agendamentos.");
		}
		return await response.json();
	} else {
		throw new Error("Token de autenticação não encontrado.");
	}
}

export async function getMeetingsInDateRange(startDate: Date, endDate?: Date) {
	const jwt = cookies().get("Authorization")?.value!;
	if (jwt) {
		const request = endDate
			? "/meetings/interval?startDate=" +
				startDate.toISOString() +
				"&endDate=" +
				endDate.toISOString()
			: "/meetings/interval?startDate=" + startDate.toISOString();

		const response = await fetch(process.env.BACKEND_URL + request, {
			method: "GET",
			headers: {
				Authorization: jwt
			}
		});
		if (!response.ok) {
			throw new Error("Falhou ao receber dias com agendamentos.");
		}
		return await response.json();
	} else {
		throw new Error("Token de autenticação não encontrado.");
	}
}
