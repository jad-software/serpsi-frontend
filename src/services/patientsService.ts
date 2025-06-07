"use server";
import { cookies } from "next/headers";

export async function getPatientsData(isNewSession: boolean = false) {
	const jwt = (await cookies()).get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const url = isNewSession
		? "/patients/addmeeting"
		: "/patients/psychologist/";
	const response = await fetch(process.env.BACKEND_URL + url, {
		method: "GET",
		headers: {
			Authorization: jwt
		},
		cache: "no-store"
	});
	return await response.json();
}

export async function createPatient(formData: FormData) {
	const jwt = (await cookies()).get("Authorization")?.value;
	const id = (await cookies()).get("sub")?.value;

	const patientData = formData.get("patientData");

	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}

	if (patientData) {
		const patientDataObj = JSON.parse(patientData.toString());

		patientDataObj.psychologistId = id;
		formData.set("patientData", JSON.stringify(patientDataObj));
		console.log("Paciente: ", patientDataObj);
		console.log("Paciente JSON: ", formData);
	}

	const response = await fetch(process.env.BACKEND_URL + "/patients", {
		method: "POST",
		headers: {
			Authorization: jwt
		},
		body: formData
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.log(response);
		throw new Error(errorData.message || "Erro ao criar o paciente.");
	}

	return await response.json();
}

export async function updatePatient(formData: FormData, id: string) {
	const jwt = (await cookies()).get("Authorization")?.value;

	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}

	const response = await fetch(process.env.BACKEND_URL + "/patients/" + id, {
		method: "PUT",
		headers: {
			Authorization: jwt,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(formData)
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erro ao atualizar o paciente.");
	}

	return await response.json();
}
