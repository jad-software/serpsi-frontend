"use server";

import { cookies } from "next/headers";
import { BillsColumns } from "@/app/(pages)/bills/columns";
import { revalidateTag } from "next/cache";

export async function getData(): Promise<BillsColumns[]> {
  const jwt = (await cookies()).get("Authorization")?.value!;
  if (!jwt) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login novamente."
    );
  }
  let data = await fetch(`${process.env.BACKEND_URL}/bills`, {
    method: "GET",
    next: {
      tags: ["bills"]
    },
    headers: {
      Authorization: jwt
    },
    cache: "no-store",
  }
  );
  let bills = await data.json();
  return bills;
}

export async function setBills(data: BillsColumns) {

  const jwt = (await cookies()).get("Authorization")?.value!;
  const sub = (await cookies()).get("sub")?.value!;
  if (!jwt) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login novamente."
    );
  }
  const body = {
    psychologist_id: sub,
    amount: data._amount,
    dueDate: data._dueDate,
    title: data._title,
    billType: data._billType
  };
  let response = await fetch(`${process.env.BACKEND_URL}/bills`,
    {
      method: "POST",
      headers: {
        Authorization: jwt,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
  return await response.json();
}

export async function updateManyBills(data: BillsColumns[], paymentMethod: { _paymentType: string, _paymentDate: Date }) {
  const jwt = (await cookies()).get("Authorization")?.value!;
  if (!jwt) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login novamente."
    );
  }
  const body = {
    billIds: data.map((bill) => bill._id._id),
    paymentMethod: {
      paymentType: paymentMethod._paymentType,
      paymentDate: paymentMethod._paymentDate.toISOString().split("T")[0]
    }
  }
  let response = await fetch(`${process.env.BACKEND_URL}/bills/payment`,
    {
      method: "PUT",
      headers: {
        Authorization: jwt,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
  return response.json();
}

export async function updateOneBill(data: BillsColumns) {
  const jwt = (await cookies()).get("Authorization")?.value!;
  if (!jwt) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login novamente."
    );
  }
  const body = {
    amount: data._amount,
    dueDate: data._dueDate,
    title: data._title,
    billType: data._billType
  };
  let response = await fetch(`${process.env.BACKEND_URL}/bills/editing/${data._id._id}`,
    {
      method: "PUT",
      headers: {
        Authorization: jwt,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
  return response.json();
}

export async function deleteBill(data: BillsColumns) {
  const jwt = (await cookies()).get("Authorization")?.value!;
  if (!jwt) {
    throw new Error(
      "Token de autenticação não encontrado. Por favor, faça login novamente."
    );
  }
  await fetch(
    process.env.BACKEND_URL + "/bills/" + data._id._id,
    {
      method: "DELETE",
      headers: {
        Authorization: jwt,
        "Content-Type": "application/json"
      }
    });
}
