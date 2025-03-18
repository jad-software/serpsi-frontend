import { getCookies } from "@/services/profileService";

export const handleAditionalFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
  if (!event.target.files) return;

  const files = Array.from(event.target.files);
  const formData = new FormData();
  const jwt = await getCookies();

  files.forEach((file) => {
    formData.append("documents", file);
  });
  formData.append("meeting", id);

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/documents/aditional", {
    method: "POST",
    headers: {
      Authorization: jwt,
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log('ErrorData', errorData);
    throw new Error("Erro ao enviar arquivos");
  }

  const result = await response.json();
  return result;
}