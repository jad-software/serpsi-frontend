"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";
import { setUserCookies } from "./userService";

export async function login(form: FormData): Promise<Record<string, string>> {
	const login = {
		email: form.get("email")?.toString(),
		password: form.get("password")?.toString()
	};

	const schema = z.object({
		email: z
			.string()
			.email({ message: "Formato de E-mail inválido" })
			.min(1, { message: "E-mail não pode estar vazio" }),

		password: z.string().min(1, { message: "Senha não pode estar vazia" })
	});
	const result = schema.safeParse(login);

	if (result.success) {
		const response = await fetch(process.env.BACKEND_URL + "/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: login.email,
				password: login.password
			})
		});
		const payload = await response.json();
		if (!response.ok) {
			throw new Error("e-mail ou senha incorretos");
		}
		(await cookies()).set({
			name: "Authorization",
			value: "Bearer " + payload.access_token,
			secure: true,
			httpOnly: true,
			expires: new Date(jwtDecode(payload.access_token).exp! * 1000)
		});
		(await cookies()).set({
			name: "sub",
			value: payload.payload.sub,
			secure: true,
			httpOnly: true,
			expires: new Date(jwtDecode(payload.access_token).exp! * 1000)
		});
		(await cookies()).set({
			name: "role",
			value: payload.payload.role,
			secure: true,
			httpOnly: true,
			expires: new Date(jwtDecode(payload.access_token).exp! * 1000)
		});
		await setUserCookies();

		(await cookies()).set({
			name: 'firstLogin',
			value: payload.payload.firstLogin
		});
		
		if ( payload.payload.firstLogin) {
			return redirect("/home/schedule-definer?first=true")
		}
		else {
			return redirect("/home");
		}

	} else {
		const errors: Record<string, string> = {};
		result.error.issues.forEach((error) => {
			errors[error.path[0]] = error.message;
		});
		throw new Error(JSON.stringify(errors));
	}
}

export async function logout() {
	(await cookies()).delete("Authorization");
	(await cookies()).delete("sub");
	(await cookies()).delete("role");
	(await cookies()).delete("name");
	(await cookies()).delete("profilePic");
}

export async function createPsychologist(formData: FormData) {


	const response = await fetch(process.env.BACKEND_URL + "/auth/register/psychologist", {
		method: "POST",
		headers: {
		},
		body: formData
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.log(errorData);
		throw new Error(errorData.message || "Erro ao criar o psicólogo.");
	}

	return await response.json();
}
