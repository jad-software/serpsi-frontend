"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function getData() {
	let user = {
		name: cookies().get("name")?.value!,
		profilePic: cookies().get("profilePic")?.value!
	};
	return user;
}

export async function setUserCookies() {
	const jwt = cookies().get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const sub = cookies().get("sub")?.value!;
	const userResponse = await fetch(
		process.env.BACKEND_URL + "/psychologists/" + sub,
		{
			method: "GET",
			next: { revalidate: 30 },
			headers: {
				Authorization: jwt
			}
		}
	);
	if (!userResponse.ok) {
		return;
	}
	const data = await userResponse.json();
	cookies().set({
		name: "name",
		value: data.user.person._name,
		secure: true,
		httpOnly: true,
		expires: new Date(jwtDecode(jwt).exp! * 1000)
	});
	cookies().set({
		name: "profilePic",
		value: data.user.person._profilePicture,
		secure: true,
		httpOnly: true,
		expires: new Date(jwtDecode(jwt).exp! * 1000)
	});
}
