"use server";
import { cookies } from "next/headers";

export async function getSessions(id: string) {
  const jwt = cookies().get("Authorization")?.value!;
  if (!jwt) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login novamente."
    );
  }
  const response = await fetch(
    process.env.BACKEND_URL + "/patients/meetings/" + id,
    {
      method: "GET",
      headers: {
        Authorization: jwt
      },
      cache: "no-store"
    }
  );
  return await response.json();

}