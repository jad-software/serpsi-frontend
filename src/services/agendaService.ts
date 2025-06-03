"use server";
import { ScheduleAgendas } from "@/app/(pages)/home/schedule-definer/dayTypes";
import { cookies } from "next/headers";

export async function setAgenda(
	data: ScheduleAgendas
): Promise<any | undefined> {
	const jwt = (await cookies()).get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const sub = (await cookies()).get("sub")?.value!;
	data.psychologistId = sub;
	const response = await fetch(process.env.BACKEND_URL + "/agendas", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: jwt
		},
		body: JSON.stringify({
			psychologistId: data.psychologistId,
			meetDuration: data.meetDuration,
			meetValue: data.meetValue,
			agendas: data.agendas
		})
	});
	return await response.json();
}

export async function getAgenda(): Promise<ScheduleAgendas | undefined> {
	const jwt = (await cookies()).get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const sub = cookies().get("sub")?.value!;
	const response = await fetch(
		process.env.BACKEND_URL + "/agendas/" + sub,
		{
			method: "GET",
			next: { revalidate: 1 },
			headers: {
				Authorization: jwt
			}
		}
	);
	return await response.json();
}
