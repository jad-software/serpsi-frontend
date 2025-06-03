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

export async function resetPass(token: string, newPass: string, confirmNewPass: string) {

  const result = await fetch(process.env.BACKEND_URL + '/token/forgotPassword', {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      newPassword: newPass,
      confirmNewPassword: confirmNewPass,
      token: token
    })
  });

  if (!result.ok) {
    throw new Error('Erro ao Redefinir a senha');
  }

  return redirect("/login");
}
