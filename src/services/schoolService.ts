"use server";
import { cookies } from "next/headers";

export type TypeSchool = {
	nome: string | undefined;
	cnpj: string | undefined;
};

export type TypeSchoolData = {
	_name: string;
	_id: {
		_id: string;
	};
	_CNPJ: {
		_code: string;
	};
	_phone: {
		_ddi: string;
		_ddd: string;
		_number: string;
	};
	_address: {
		_city: string;
		_zipCode: string;
		_street: string;
		_district: string;
		_state: string;
		_homeNumber: string;
		_complement: string;
		_id: {
			_id: string;
		};
	};
};

export async function getSchool({
	...params
}: TypeSchool): Promise<TypeSchoolData | undefined> {
	const jwt = cookies().get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	let request = "";
	if (params.nome) {
		request += `name=${params.nome}`;
	}
	if (params.cnpj) {
		if (request.length > 0) request += "&";
		request += `CNPJ=${params.cnpj}`;
	}

	const response = await fetch(
		`${process.env.BACKEND_URL}/school/search?${request}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: jwt
			}
		}
	);

	if (!response.ok) {
		return;
	}
	return await response.json();

}
