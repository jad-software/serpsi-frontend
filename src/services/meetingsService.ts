"use server";
import { Meeting } from "@/models/Entities/ Meeting";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export async function getHourAvailableByDate(startDate: string) {
  const jwt = cookies().get("Authorization")?.value!;
  if (jwt) {
    const response = await fetch(
      process.env.BACKEND_URL + "/meetings/avaliable_times?startDate=" + startDate,
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

export async function createMeeting(meetingData: Meeting) {
  const jwt = cookies().get("Authorization")?.value;
  const id = cookies().get("sub")?.value;
  if (!jwt || !id) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login novamente."
    );
  }

  meetingData.psychologist = id;
  const response = await fetch(process.env.BACKEND_URL + "/meetings", {
    method: "POST",
    headers: {
      Authorization: jwt,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schedule: meetingData.schedule,
      patient: meetingData.patient,
      psychologist: meetingData.psychologist,
      quantity: meetingData.quantity,
      frequency: meetingData.frequency
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log('ErrorData', errorData);
    throw new Error(errorData.message || "Erro ao criar o paciente.");
  }
  return redirect("/sessions/select");

}
export async function getMeeting(id: string) {
  const jwt = cookies().get("Authorization")?.value!;
  if (jwt) {
    const response = await fetch(
      process.env.BACKEND_URL + "/meetings/" + id, {
      method: 'GET',
      headers: {
        Authorization: jwt
      },
      cache: "no-store"
    })
    return await response.json();
  }
}
