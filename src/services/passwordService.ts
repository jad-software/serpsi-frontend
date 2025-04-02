'use server'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function forgotPass(email: string) {
  const result = await fetch(process.env.BACKEND_URL + '/token/generate', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email
    })
  });

  if (!result.ok) {
    throw new Error('Erro ao enviar E-mail');
  }

  return redirect("/login");
}