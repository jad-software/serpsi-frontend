"use server";
import { PatientData } from "@/app/(pages)/patients/[id]/patientSchema";
import { Patient } from "@/models";
import { cookies } from "next/headers";

export async function getData(id: string): Promise<PatientData> {
	const response = await fetch(process.env.BACKEND_URL + "/patients/" + id, {
		headers: {
			Authorization: cookies().get("Authorization")?.value!,
		},
		next: { revalidate: 30 }
	});
	return response.json();
}