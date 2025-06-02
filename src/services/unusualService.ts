"use server";
import { cookies } from "next/headers";

type UnusualDay = {
	date: string;
	unavaliableTimes: {
		_startTime: string;
		_endTime: string;
	}[];
};

export async function setUnusual(data: UnusualDay): Promise<any | undefined> {
	const jwt = (await cookies()).get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const response = await fetch(process.env.BACKEND_URL + "/unusual", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: jwt
		},
		body: JSON.stringify({
			date: data.date,
			unavaliableTimes: data.unavaliableTimes
		})
	});
	return await response.json();
}