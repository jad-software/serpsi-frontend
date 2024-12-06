"use client";
import { DataTable } from "@/components/table/data-table";
import { columns, DocumentColumns } from "./columns";
import { getData } from "@/services/documentsService";
import { useEffect, useState } from "react";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	Row,
	useReactTable
} from "@tanstack/react-table";
import { DownloadIcon, SearchIcon } from "@heroicons/react/outline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DownloadFile } from "@/services/utils/downloadFile";

export default function Documents() {
	const [data, setData] = useState({} as DocumentColumns[]);
	useEffect(() => {
		async function fetchData() {
			const data = (await getData()) as DocumentColumns[];
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
		<main className="flex h-full w-full items-center justify-center bg-white p-3">
			<DataTable
				columns={columns}
				table={table}
				filteringNode={
					<div className="border-1 flex max-w-[300px] items-center rounded-lg border px-2">
						<SearchIcon className="h-6 w-6" />
						<Input
							id="busca"
							className="border-0 text-start focus-visible:ring-0"
							placeholder={`Procurar por paciente...`}
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
				selectedAction={
					<div className="flex flex-grow items-end justify-end gap-2 text-center text-primary-600">
						<Button
							variant="link"
							className="gap-2 text-center text-primary-600"
							onClick={() =>
								downloadMultiFiles(
									table.getFilteredSelectedRowModel()
										.rows as Row<DocumentColumns>[]
								)
							}
						>
							Baixar arquivos selecionados{" "}
							<DownloadIcon className="h-4 w-4" />
						</Button>
					</div>
				}
			/>
		</main>
	);
}

async function downloadMultiFiles(rows: Row<DocumentColumns>[]) {
	await Promise.all(
		rows.map((value) => {
			DownloadFile(
				value.original.docLink,
				value.original.name + " - " + value.original.title
			);
		})
	);
}
