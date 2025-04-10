"use client";

import {
	Table as TableComponent,
	TableCell,
	TableFooter,
	TableRow
} from "@/components/ui/table";
import {
	ColumnDef,
	Table
} from "@tanstack/react-table";
import { PaginationTable } from "./pagination-table";
import { HeaderTable } from "./header-table";
import { BodyTable } from "./body-table";
import { ReactNode, useState } from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	linkTop?: ReactNode;
	selectedAction?: ReactNode;
	filteringNode: ReactNode;
	table: Table<TData>;
}
export function DataTable<TData, TValue>({
	columns,
	linkTop,
	selectedAction,
	filteringNode,
	table
}: DataTableProps<TData, TValue>) {
	return (
		<section className="flex flex-col items-start gap-2 rounded-[20px] w-full lg:w-4/5">
			{/* seção de filtros para a tabela */}
			<section className="flex w-full items-center justify-start gap-4">
				{filteringNode ?? null}
				{/** seção para arquivos selecionados. disponivel apenas para documentos por enquanto */}
				{table.getFilteredSelectedRowModel().rows.length > 0 && selectedAction
					? selectedAction
					: null}
			</section>
			{/* se verdadeiro aparece o Link para cadastrar novo paciente */}
			{linkTop ?? null}

			<TableComponent className="rounded-3xl">
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
										linha(s) selecionadas de
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
			</TableComponent>
		</section>
	);
}

