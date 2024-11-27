"use client"
import { DataTable } from "@/components/table/data-table";
import { columns, Patient } from "./columns";
import { getPatientsData } from "@/services/patientsService";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SelectPatientsPage() {
	const [data, setData] = useState({} as Patient[]);
	useEffect(() => {
		async function fetchData() {
			const data = await getPatientsData(true);
			setData(data);
		}
		fetchData();
	}, []);
	const [rowSelection, setRowSelection] = useState({});
	let table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection
		}
	});
	return (
		<main className="flex h-full w-full items-center justify-center bg-white p-4">
			<DataTable
				columns={columns}
				table={table}
				linkTop={
					<section>
						<Link
							href="/patients/register"
							className="text-sm font-medium text-primary-600 underline"
						>
							Cadastrar novo paciente
						</Link>
					</section>
				}
				filteringNode={
					<div className="border-1 flex max-w-[300px] items-center rounded-lg border px-2">
						<SearchIcon className="h-6 w-6" />
						<Input
							id="busca"
							className="border-0 text-start focus-visible:ring-0"
							placeholder={`Procurar por nome...`}
							value={
								(table
									.getColumn("name")
									?.getFilterValue() as string) ?? ""
							}
							onChange={(event) =>
								table
									.getColumn("name")
									?.setFilterValue(event.target.value)
							}
						/>
					</div>
				}
			/>
		</main>
	);
}
