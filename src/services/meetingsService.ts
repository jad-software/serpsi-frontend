"use server";
import { cookies } from "next/headers";

export async function getSessions(id: string) {
  const jwt = cookies().get("Authorization")?.value!;
  if (jwt) {
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
}

export async function getHourAvailableByDate(startDate: string){
  const jwt = cookies().get("Authorization")?.value!;
  if (jwt) {
    const response = await fetch(
      process.env.BACKEND_URL + "/meetings/avaliable_times?startDate="+startDate,
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
}
