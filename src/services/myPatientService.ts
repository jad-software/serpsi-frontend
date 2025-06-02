"use server";
import { PatientData } from "@/app/(pages)/patients/[id]/patientSchema";
import { cookies } from "next/headers";

export async function getData(id: string): Promise<PatientData> {
	const response = await fetch(process.env.BACKEND_URL + "/patients/" + id, {
		headers: {
			Authorization: (await cookies()).get("Authorization")?.value!,
		},
		next: { revalidate: 0 }
	});
	return response.json();
}
