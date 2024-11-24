import { getCookies } from "@/services/profileService";

export async function updateProfilePicture(id: string, file: FileList) {
  const formData = new FormData();
  formData.append('profilePicture', file[0]);
	const jwt = await getCookies();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/persons/picture/${id}`, {
    method: "PUT",
    headers: {
      Authorization: jwt, 
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Erro ao enviar a imagem');
  }

  return await response.json();
}
