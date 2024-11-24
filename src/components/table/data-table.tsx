"use client";

import { Table, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import {
	ColumnDef,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	getFilteredRowModel,
	Row
} from "@tanstack/react-table";
import { Input } from "../ui/input";
import Link from "next/link";
import { PaginationTable } from "./pagination-table";
import { HeaderTable } from "./header-table";
import { BodyTable } from "./body-table";
import { DownloadIcon, SearchIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Button } from "../ui/button";
import { DownloadFile } from "@/services/utils/downloadFile";
import { DocumentColumns } from "@/app/(pages)/documents/columns";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	linkTop?: boolean;
	filteringColumn: string;
	filteringPlaceHolder: string,
}
export function DataTable<TData, TValue>({
	columns,
	data,
	linkTop,
	filteringColumn,
	filteringPlaceHolder
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState({});
	const table = useReactTable({
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
		<section className="flex flex-col items-start gap-2 rounded-[20px] lg:w-4/5">
			{/* seção de filtros para a tabela */}
			<section className="flex w-full items-center justify-between gap-4">
				<div className="border-1 flex max-w-[300px] items-center rounded-lg border px-2">
					<SearchIcon className="h-6 w-6" />
					<Input
						id="busca"
						className="border-0 text-start focus-visible:ring-0"
						placeholder={`Procurar por ${filteringPlaceHolder}...`}
						value={
							(table
								.getColumn(filteringColumn)
								?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table
								.getColumn(filteringColumn)
								?.setFilterValue(event.target.value)
						}
					/>
				</div>
				{/** seção para arquivos selecionados. disponivel apenas para documentos por enquanto */}
				{table.getFilteredSelectedRowModel().rows.length > 0 ? (
					<Button
						variant="link"
						className="flex items-center justify-center gap-2 text-center text-primary-600"
						onClick={() =>
							downloadMultiFiles(
								table.getFilteredSelectedRowModel().rows as Row<DocumentColumns>[]
							)
						}
					>
						Baixar arquivos selecionados{" "}
						<DownloadIcon className="h-4 w-4" />
					</Button>
				) : null}
			</section>
			{/* se verdadeiro aparece o Link para cadastrar novo paciente */}
			{linkTop ? (
				<section>
					<Link
						href="/patients/register"
						className="text-sm font-medium text-primary-600 underline"
					>
						Cadastrar novo paciente
					</Link>
				</section>
			) : null}

			<Table className="rounded-3xl">
				<HeaderTable table={table} />
				<BodyTable table={table} columns={columns} />
				<TableFooter>
					<TableRow className="hover:bg-white">
						<TableCell colSpan={columns.length - 2}>
							{table.getFilteredSelectedRowModel().rows.length >
							0 ? (
								<p className="text-sm font-bold text-primary-600">
									{
										table.getFilteredSelectedRowModel().rows
											.length
									}{" "}
									<span className="font-normal">
										documento(s) selecionados de
									</span>{" "}
									{table.getPreFilteredRowModel().rows.length}
								</p>
							) : null}
						</TableCell>
						<TableCell colSpan={2} className="h-10 px-8">
							{table.getPageCount() > 1 ? (
								<PaginationTable table={table} />
							) : null}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</section>
	);
}
async function downloadMultiFiles(rows: Row<DocumentColumns>[]) {
	await Promise.all(
		rows.map((value) => {
			DownloadFile(value.original._docLink, value.original._name + " - " + value.original._title);
		})
	);
}
