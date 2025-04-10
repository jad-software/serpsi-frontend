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
import { CurrencyDollarIcon, SearchIcon } from "@heroicons/react/outline";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from "@/components/ui/select";
import { UpdateManyBillDialog } from "./updateManyBillDialog";
import { toast } from "sonner";

export default function BillsPage() {
	const [data, setData] = useState({} as BillsColumns[]);
	const [rowSelection, setRowSelection] = useState({});

	let table = useReactTable({
		data,
		columns: columns(() => refreshData()),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection
		}
	});

	async function refreshData() {
		const updatedData = await getData();
		setData(updatedData);
		setRowSelection({})
	}

	useEffect(() => {
		refreshData();
	}, []);
	return (
		<main className="flex h-full w-full flex-col items-center justify-center bg-white p-3">
			<DataTable
				columns={columns(() => refreshData())}
				table={table}
				filteringNode={
					<div className="flex w-full justify-start gap-4">
						<div className="border-1 flex w-full max-w-[200px] items-center rounded-lg border border-primary-600 px-2">
							<SearchIcon className="h-5 w-5" />
							<Input
								id="busca"
								className="border-0 text-start focus-visible:ring-0"
								placeholder={`Procurar por nome...`}
								value={
									(table
										.getColumn("_title")
										?.getFilterValue() as string) ?? ""
								}
								onChange={(event) =>
									table
										.getColumn("_title")
										?.setFilterValue(event.target.value)
								}
							/>
						</div>
						<Select
							value={
								(table
									.getColumn("_billType")
									?.getFilterValue() as string) ?? ""
							}
							onValueChange={(value) =>
								value !== "TODOS"
									? table
										.getColumn("_billType")
										?.setFilterValue(value)
									: table
										.getColumn("_billType")
										?.setFilterValue(undefined)
							}
						>
							<SelectTrigger
								className={
									"w-full max-w-[200px] border-primary-600 px-2 text-gray-500 focus:ring-0"
								}
							>
								<SelectValue placeholder="Selecione o tipo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="TODOS">Todos</SelectItem>
								<SelectItem value="A PAGAR">A pagar</SelectItem>
								<SelectItem value="A RECEBER">
									A receber
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				}
				linkTop={
					<NewBillDialog
						onSuccess={refreshData}
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
					<UpdateManyBillDialog
						onSuccess={() => {
							refreshData();
						}}
						triggerButton={
							<button
								className="inline-flex items-center justify-center whitespace-nowrap w-fit text-sm font-medium text-primary-600 underline gap-1"
							>
								Adicionar pagamentos
								<CurrencyDollarIcon className="h-4 w-4" />
							</button>
						}
						bills={table.getFilteredSelectedRowModel().rows}
					/>
				}
			/>
		</main>
	);
}
