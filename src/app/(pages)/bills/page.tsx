"use client";
import { DataTable } from "@/components/table/data-table";
import { BillsColumns, columns } from "./columns";
import { getData } from "@/services/billsService";
import Link from "next/link";
import { NewBillDialog } from "./newBillDialog";
import { useEffect, useState } from "react";


export default function BillsPage() {
	

	const [data, setData] = useState({} as BillsColumns[]);
	useEffect(() => {
		async function fetchData() {
			const data = await getData();
			setData(data);
		}
		fetchData();
	}, []);

	return (
		<main className="flex h-full w-full flex-col items-center justify-center bg-white p-3">
			<DataTable
				columns={columns}
				data={data!}
				filteringColumn="name"
				filteringPlaceHolder="nome"
				linkTop={
					<NewBillDialog
						triggerButton={
							<Link
								href=""
								className="text-sm font-medium text-primary-600 underline"
							>
								Cadastrar nova conta
							</Link>
						}
					/>
				}
			/>
		</main>
	);
}
