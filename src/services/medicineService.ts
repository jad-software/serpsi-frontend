"use server";
import { cookies } from "next/headers";
export async function addMedicament(formData: FormData, id: string) {
  const jwt = (await cookies()).get("Authorization")?.value;

	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const response = await fetch(
		process.env.BACKEND_URL + "/patients/" + id + "/medicament",
		{
			method: "PUT",
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(formData)
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erro ao atualizar o paciente.");
	}

	return await response.json();
}

export async function deleteMedicament(id: string, medicamentId: string) {
  const jwt = (await cookies()).get("Authorization")?.value;

	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}

	return fetch(
		process.env.BACKEND_URL +
			"/patients/" +
			id +
			"/medicament/" +
			medicamentId,
		{
			method: "DELETE",
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json"
			}
		}
	);
}
