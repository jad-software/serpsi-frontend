"use server";

export async function confirmEmail(token: string): Promise<boolean> {
	try {
		const response = await fetch(
			`${process.env.BACKEND_URL}/token/confirmUser`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ token })
			}
		);

		if (response.ok) {
			return true;
		} else {
			console.error(
				"Erro ao confirmar e-mail:",
				response.status,
				await response.text()
			);
			return false;
		}
	} catch (error) {
		console.error("Erro de rede:", error);
		return false;
	}
}
