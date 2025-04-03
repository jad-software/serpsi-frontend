"use server";
import { Patient } from "@/models";
import { cookies } from "next/headers";

export async function getData(id: string): Promise<Patient> {
	const response = await fetch(process.env.BACKEND_URL + "/patients/" + id, {
		headers: {
			Authorization: cookies().get("Authorization")?.value!,
		},
		next: { revalidate: 30 }
	});
	return response.json();
}