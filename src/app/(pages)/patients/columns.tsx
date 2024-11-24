"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PencilAltIcon } from "@heroicons/react/outline";

export type Patient = {
	id: string;
	name: string;
	paymentPlan: "Mensal" | "Bimestral" | "Trimestral" | "Avulso";
	documento: string;
};

export const columns: ColumnDef<Patient>[] = [
	{
		accessorKey: "id",
		header: () => (
			<div className="flex w-[70px] justify-center">Editar</div>
		),
		size: 70,
		cell: (e) => (
			<Link href={"/patients/"+ e.getValue() + "?name=" + e.row.original.name} className="flex justify-center">
				<PencilAltIcon width={24} height={24} />
			</Link>
		)
	},
	{
		accessorKey: "name",
		header: "Paciente",
		size: 250
	},
	{
		accessorKey: "cpf",
		header: "Documento",
		size: 250
	},
	{
		accessorKey: "payment_plan",
		header: "Plano de pagamento",
		size: 250
	}
];

