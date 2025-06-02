import { getCookies } from "@/services/profileService";

export const handleAditionalFileUpload = async (
	event: React.ChangeEvent<HTMLInputElement>,
	id: string
) => {
	if (!event.target.files) return;

	const files = Array.from(event.target.files);
	const formData = new FormData();
	const jwt = await getCookies();

	files.forEach((file) => {
		formData.append("documents", file);
	});
	formData.append("meeting", id);

	const response = await fetch(
		process.env.NEXT_PUBLIC_BACKEND_URL + "/documents/aditional",
		{
			method: "POST",
			headers: {
				Authorization: jwt
			},
			body: formData
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error("Erro ao enviar arquivos");
	}

	const result = await response.json();
	return result;
};

export const handleSessionReportUpload = async (
	title = "Relato de sessão",
	meeting: string,
	sessionReport: Blob
) => {
	const formData = new FormData();
	const jwt = await getCookies();
	formData.append("title", title);
	formData.append("meeting", meeting);
	formData.append("document", sessionReport, "relato_sessao.md");

	const response = await fetch(
		process.env.NEXT_PUBLIC_BACKEND_URL + "/documents",
		{
			method: "POST",
			headers: {
				Authorization: jwt
			},
			body: formData
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error("Erro ao enviar relato de sessão");
	}

	const result = await response.json();
	return result;
};
