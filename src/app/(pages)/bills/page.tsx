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
						<Select
							value={
								(table
									.getColumn("billType")
									?.getFilterValue() as string) ?? ""
							}
							onValueChange={(value) =>
								value !== "TODOS"
									? table
											.getColumn("billType")
											?.setFilterValue(value)
									: table
											.getColumn("billType")
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
								<SelectItem value="PAGO">Pago</SelectItem>
								<SelectItem value="RECEBIDO">
									Recebido
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				}
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
					<UpdateManyBillDialog
						triggerButton={
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
						}
						bills={table.getFilteredSelectedRowModel().rows}
					/>
				}
			/>
		</main>
	);
}
