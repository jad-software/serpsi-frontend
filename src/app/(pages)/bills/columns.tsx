"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilAltIcon } from "@heroicons/react/outline";
import { UpdateOneBillDialog } from "./updateOneBillDialog";

export type BillsColumns = {
	id: string;
	name: string;
	billType: string;
	value: number;
	paymentDate: string;
	dueDate: string;
};

export const columns: ColumnDef<BillsColumns>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex justify-center">
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) =>
						table.toggleAllPageRowsSelected(!!value)
					}
					aria-label="Selecione todas as linhas"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex justify-center">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Selecione a linha"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: "edit",
		header: "",
		size: 70,
		cell: ({ row }) => (
			<UpdateOneBillDialog
			bill={row.original}
			triggerButton={
				<PencilAltIcon width={24} height={24} className="text-primary-600" />
			}
			/>
		)
	},
	{
		accessorKey: "name",
		header: "Nome",
		size: 250
	},
	{
		accessorKey: "billType",
		header: "Tipo",
		cell: (e) => {
			let className =
				e.getValue() == "A pagar" || e.getValue() == "A receber"
					? "text-orange-600"
					: "text-green-600";
			return (e.getValue() as string) ? (
				<p className={className}>{e.getValue() as string}</p>
			) : (
				<p>-</p>
			);
		},
		size: 250
	},
	{
		accessorKey: "value",
		header: "Valor",
		cell: (e) => {
			return (
				"R$ " + (e.getValue() as Number).toFixed(2).replace(".", ",")
			);
		},
		size: 250
	},
	{
		accessorKey: "dueDate",
		header: "Data de vencimento",
		size: 250
	},
	{
		accessorKey: "paymentDate",
		header: "Data da pagamento",
		cell: (e) => {
			return (e.getValue() as string) ? (
				<p>{e.getValue() as string}</p>
			) : (
				<p>-</p>
			);
		},
		size: 250
	}
];
