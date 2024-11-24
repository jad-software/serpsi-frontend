"use server";
import { ScheduleAgendas } from "@/app/(pages)/home/schedule-definer/dayTypes";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function setAgenda(
	data: ScheduleAgendas
): Promise<any | undefined> {
	const jwt = cookies().get("Authorization")?.value!;
	if (jwt) {
		const sub = cookies().get("sub")?.value!;
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
	return redirect("/login");
}

export async function getAgenda(): Promise<ScheduleAgendas | undefined> {
	const jwt = cookies().get("Authorization")?.value!;
	if (jwt) {
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
}
