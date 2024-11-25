"use server";

import { cookies } from "next/headers";
import { DocumentColumns } from "@/app/(pages)/documents/columns";
import { formatDateToddmmYYYY } from "./utils/formatDate";

export async function getData() {
	const jwt = cookies().get("Authorization")?.value!;
	const sub = cookies().get("sub")?.value!;
	if (jwt) {
			let data = await fetch(
				process.env.BACKEND_URL + "/documents/psychologist/" + sub,
				{
					method: "GET",
					next: { revalidate: 30 },
					headers: {
						Authorization: jwt
					}
				}
			);
		let documents = await data.json();
		let response: DocumentColumns[] = [];
		documents?.forEach((value: any) => {
			const res: DocumentColumns = {
				id: value.id,
				title: value.title,
				docLink: value.docLink,
				name: value.name,
				createDate: formatDateToddmmYYYY(value.createDate) || "-"
			}
			response.push(res);
		})
		return response;
	}
}
