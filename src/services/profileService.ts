"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function getProfileData() {
	const jwt = cookies().get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const sub = cookies().get("sub")?.value!;
	const response = await fetch(
		process.env.BACKEND_URL + "/psychologists/" + sub,
		{
			method: "GET",
			next: { revalidate: 1 },
			headers: {
				Authorization: jwt
			}
		}
	);
	return await response.json();

}

export async function setProfile(data: any): Promise<any> {
	const jwt = cookies().get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const sub = cookies().get("sub")?.value!;
	const response = await fetch(
		process.env.BACKEND_URL + "/psychologists/" + sub,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: jwt
			},
			body: JSON.stringify(data)
		}
	);
	const returnedData = await response.json();
	// if (response.ok) {
	//   revalidatePath(`/psychologists/${sub}`);
	// }
	cookies().set({
		name: "name",
		value: returnedData.user.person._name,
		secure: true,
		httpOnly: true,
		expires: new Date(jwtDecode(jwt).exp! * 1000)
	});
	cookies().set({
		name: "profilePic",
		value: returnedData.user.person._profilePicture,
		secure: true,
		httpOnly: true,
		expires: new Date(jwtDecode(jwt).exp! * 1000)
	});
	return returnedData;
}

export async function getCookies() {
	const jwt = cookies().get("Authorization")?.value!;
	return jwt;
}
export async function changePassword(data: any) {
	const jwt = cookies().get("Authorization")?.value!;
	if (!jwt) {
		throw new Error(
			"Token de autenticação não encontrado. Por favor, faça login novamente."
		);
	}
	const sub = cookies().get("sub")?.value!;
	const response = await fetch(
		process.env.BACKEND_URL + "/psychologists/updatePassword/" + sub,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: jwt
			},
			body: JSON.stringify(data)
		}
	);
	if (response.ok) {
		const returnedData = await response.json();
		return returnedData;
	} else {
		throw new Error("Houve um erro.");
	}
}

// export async function updateProfilePicture(id: string, file: FileList) {
//   const jwt = cookies().get("Authorization")?.value!;
//   if (jwt) {
//     const formData = new FormData();
//     formData.append('profilePicture', file[0]);

//     const response = await fetch(`${process.env.BACKEND_URL}/persons/picture/${id}`, {
//       method: "PUT",
//       headers: {
//         Authorization: jwt,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Erro ao enviar a imagem');
//     }

//     return await response.json();
//   }
//   return undefined;
// }
