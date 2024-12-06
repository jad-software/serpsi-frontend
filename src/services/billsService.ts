"use server";

import { cookies } from "next/headers";
import { DocumentColumns } from "@/app/(pages)/documents/columns";
import { formatDateToddmmYYYY } from "./utils/formatDate";
import { BillsColumns } from "@/app/(pages)/bills/columns";

export async function getData(): Promise<BillsColumns[]> {
  // const jwt = cookies().get("Authorization")?.value!;
  // const sub = cookies().get("sub")?.value!;
  // if (jwt) {
  // 		let data = await fetch(
  // 			process.env.BACKEND_URL + "/bills" + sub,
  // 			{
  // 				method: "GET",
  // 				next: { revalidate: 30 },
  // 				headers: {
  // 					Authorization: jwt
  // 				}
  // 			}
  // 		);
  // 	let documents = await data.json();
  // 	})
  // 	return response;
  // }
  return [
    {
      id: "1",
      name: "Roberto Santos",
      billType: "A RECEBER", 
      value: 100.00,
      dueDate: new Date("2021-12-01"),
    },
    {
      id: "2",
      name: "João",
      billType: "A RECEBER",
      value: 200.10,
      dueDate: new Date("2021-01-01"),
    },
    {
      id: "3",
      name: "João", 
      billType: "A RECEBER",
      value: 300.50,
      dueDate: new Date("2021-01-01"),
    },
    {
      id: "4",
      name: "Pedro",
      billType: "A RECEBER",
      value: 200.10,
      paymentDate: new Date("2021-01-01"),
      dueDate: new Date("2021-01-01"),
    },
    {
      id: "5",
      name: "Luz",
      billType: "A PAGAR",
      value: 300.50,
      paymentDate: new Date("2021-01-01"),
      dueDate: new Date("2021-01-01"),
    },
    {
      id: "6",
      name: "Água",
      billType: "A PAGAR",
      value: 300.50,
      dueDate: new Date("2021-12-31"),
    },
    {
      id: "7",
      name: "João",
      billType: "A RECEBER",
      value: 200.10,
      dueDate: new Date("2021-11-30"),
    },
    {
      id: "8",
      name: "João",
      billType: "A RECEBER",
      value: 300.50,
      dueDate: new Date("2021-01-01"),
    },
    {
      id: "9",
      name: "Pedro",
      billType: "A RECEBER",
      value: 200.10,
      paymentDate: new Date("2021-01-01"),
      dueDate: new Date("2021-01-01"),
    },
    {
      id: "10",
      name: "Luz",
      billType: "A PAGAR",
      value: 300.50,
      paymentDate: new Date("2021-01-01"),
      dueDate: new Date("2021-01-01"),
    },
  ]
}

export async function setBills(data: BillsColumns) {
  // const jwt = cookies().get("Authorization")?.value!;
  // const sub = cookies().get("sub")?.value!;
  // if (jwt) {
  //   let response = await fetch(
  //     process.env.BACKEND_URL + "/bills" + sub,
  //     {
  //       method: "POST",
  //       next: { revalidate: 30 },
  //       headers: {
  //         Authorization: jwt,
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(data)
  //     }
  //   );
  //   return response;
  return data;
}

export async function updateManyBills(data: BillsColumns[], paymentDate: Date) {
  // const jwt = cookies().get("Authorization")?.value!;
  // const sub = cookies().get("sub")?.value!;
  // if (jwt) {
  //   let response = await fetch(
  //     process.env.BACKEND_URL + "/bills" + sub,
  //     {
  //       method: "PUT",
  //       next: { revalidate: 30 },
  //       headers: {
  //         Authorization: jwt,
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(data)
  //     }
  //   );
  //   return response;
  // }
  return data;
}

export async function updateOneBill(data: BillsColumns) {
  // const jwt = cookies().get("Authorization")?.value!;
  // const sub = cookies().get("sub")?.value!;
  // if (jwt) {
  //   let response = await fetch(
  //     process.env.BACKEND_URL + "/bills" + sub,
  //     {
  //       method: "PUT",
  //       next: { revalidate: 30 },
  //       headers: {
  //         Authorization: jwt,
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(data)
  //     }
  //   );
  //   return response;
  // }
  return data;
}

