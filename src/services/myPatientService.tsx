import { Patient } from "@/models";
import moment from "moment";
import { cookies } from "next/headers";
export async function getData(id: string): Promise<Patient> {
	"use server";
	const response = await fetch(process.env.BACKEND_URL + "/patients/" + id, {
		headers: {
			Authorization: cookies().get("Authorization")?.value!,
		},
		next: { revalidate: 30 }
	});
	return response.json();
}

export function formatMedicineSchedule(schedules: Date[]) {
	return schedules.map((schedule, index) => {
		return `${moment(schedule).format("HH:mm")} ${index !== schedules.length - 1 ? " / " : ""}`;
	});
}
