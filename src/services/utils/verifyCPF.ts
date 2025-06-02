"use server";
import { cookies } from "next/headers";

function validateCPF(cpf: string): boolean {
	const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
	if (!regex.test(cpf)) return false;

	const numeros = cpf.replace(/[.-]/g, "");

	if (/^(\d)\1+$/.test(numeros)) return false;

	const cpfArray = numeros.split("").map(Number);

	// primeiro digito validador
	let soma = 0;
	for (let i = 0; i < 9; i++) {
		soma += cpfArray[i] * (10 - i);
	}
	let primeiroDigito = (soma * 10) % 11;
	if (primeiroDigito === 10 || primeiroDigito === 11) primeiroDigito = 0;
	if (cpfArray[9] !== primeiroDigito) return false;

	// segundo digito validador
	soma = 0;
	for (let i = 0; i < 10; i++) {
		soma += cpfArray[i] * (11 - i);
	}
	let segundoDigito = (soma * 10) % 11;
	if (segundoDigito === 10 || segundoDigito === 11) segundoDigito = 0;
	if (cpfArray[10] !== segundoDigito) return false;

	return true;
}

async function verifyIfCPFAlreadyExists(cpf: string): Promise<boolean> {
	const jwt = (await cookies()).get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	let data = await fetch(
		`${process.env.BACKEND_URL}/persons/verify-exists/cpf/` + cpf,
		{
			method: "GET",
			headers: {
				Authorization: jwt
			},
			cache: "no-store"
		}
	);
	let alreadyExists = await data.json();
	return alreadyExists;
}

export { validateCPF, verifyIfCPFAlreadyExists };
