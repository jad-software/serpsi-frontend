"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilAltIcon } from "@heroicons/react/outline";
import { UpdateOneBillDialog } from "./updateOneBillDialog";
import { formatDateToddmmYYYY } from "@/services/utils/formatDate";

export type BillsColumns = {
	_id: { _id: string };
	_title: string;
	_billType: string;
	_amount: number;
	_dueDate: Date;
	_paymentMethod?: {
		_paymentType: string, _paymentDate: Date
	}
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
					<PencilAltIcon
						width={24}
						height={24}
						className="text-primary-600"
					/>
				}
			/>
		)
	},
	{
		accessorKey: "_title",
		header: "Nome",
		size: 250
	},
	{
		accessorKey: "_billType",
		header: "Tipo",
		cell: (e) => {
			let value = e.getValue() as string;
			if (e.row.original._paymentMethod?._paymentDate) {
				if (value.toUpperCase() == "A PAGAR") {
					value = "PAGO"
				}
				else if (value.toUpperCase() == "A RECEBER") {
					value = "RECEBIDO"
				}
			}
			let className =
				value.toUpperCase() == "A PAGAR" || value.toUpperCase() == "A RECEBER"
					? "text-orange-600"
					: "text-green-600";
			return (value as string) ? (
				<p className={className}>{value.at(0)?.toUpperCase() + value.slice(1).toLowerCase()}</p>
			) : (
				<p>-</p>
			);
		},
		size: 250
	},
	{
		accessorKey: "_amount",
		header: "Valor",
		cell: (e) => {
			return (
				"R$ " + (e.getValue() as Number).toFixed(2).replace(".", ",")
			);
		},
		size: 250
	},
	{
		accessorKey: "_dueDate",
		header: "Data de vencimento",
		cell: (e) => {
			return e.getValue() ? (
				<p>{formatDateToddmmYYYY(e.getValue() as Date)}</p>
			) : (
				<p>-</p>
			);
		},
		size: 250
	},
	{
		accessorKey: "_paymentMethod._paymentDate",
		header: "Data da pagamento",
		cell: (e) => {
			return e.getValue() ? (
				<p>{formatDateToddmmYYYY(e.getValue() as Date)}</p>
			) : (
				<p>-</p>
			);
		},
		size: 250
	}
];
