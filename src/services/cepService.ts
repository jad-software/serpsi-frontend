export type TypeCEP = {
	cep: string;
	logradouro: string;
	complemento: string;
	unidade: string;
	bairro: string;
	localidade: string;
	uf: string;
	estado: string;
};

export async function getCEP(cep: string): Promise<TypeCEP | undefined> {
	cep = cep.replace(/\D/g, "");

	if (cep.length !== 8) {
		return;
	}

	const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

	if (!response.ok) {
		return;
	}

	return await response.json();
}
