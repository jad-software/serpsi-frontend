"use server";
import { cookies } from "next/headers";
export async function getSessions(id: string) {
	const jwt = cookies().get("Authorization")?.value!;
	if (jwt) {
		const response = await fetch(
			process.env.BACKEND_URL + "/patients/meetings/" + id,
			{
				method: "GET",
				headers: {
					Authorization: jwt
				},
				cache: "no-store"
			}
		);
		return await response.json();
	}
}

export async function updateSessionStatus(id: string, status: string) {
	const jwt = cookies().get("Authorization")?.value!;
	if (jwt) {
		const response = await fetch(
			process.env.BACKEND_URL + "/meetings/status/" + id,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt
				},
				body: JSON.stringify({
					status: status
				})
			}
		);
		return await response.json();
	}
}
