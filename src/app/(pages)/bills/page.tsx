"use client";
import { DataTable } from "@/components/table/data-table";
import { BillsColumns, columns } from "./columns";
import { getData } from "@/services/billsService";
import Link from "next/link";
import { NewBillDialog } from "./newBillDialog";
import { useEffect, useState } from "react";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CurrencyDollarIcon } from "@heroicons/react/outline";

export default function BillsPage() {
	const [data, setData] = useState({} as BillsColumns[]);
	useEffect(() => {
		async function fetchData() {
			const data = await getData();
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
		<main className="flex h-full w-full flex-col items-center justify-center bg-white p-3">
			<DataTable
				columns={columns}
				data={data!}
				filteringColumn="name"
				filteringPlaceHolder="nome"
				filteringSecondColumn="billType"
				filteringSecondPlaceHolder="tipo"
				tableTd={table}
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
				selectedAction={
					<div className="flex flex-grow items-end justify-end gap-2 text-center text-primary-600">
						<Button
							variant="link"
							className="gap-2 text-center text-primary-600"
							onClick={() =>
								console.log(
									table
										.getFilteredSelectedRowModel()
										.rows.map((row) => row.original)
								)
							}
						>
							Atualizar contas selecionadas
							<CurrencyDollarIcon className="h-4 w-4" />
						</Button>
					</div>
				}
			/>
		</main>
	);
}
