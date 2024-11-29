"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/solid";

export type Patient = {
	id: string;
	name: string;
	count_meetings: number;
	cpf: string;
};

export const columns: ColumnDef<Patient>[] = [
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
		accessorKey: "count_meetings",
		header: "Qtd Sessões restantes",
		cell: (e) => (
			<div className="">{e.getValue() + " sessões"}</div>
		),
		size: 250
	},
	{
		accessorKey: "id",
		header: () => (
			<div className="flex  justify-center">Agendar Sessões</div>
		),
		size: 250,
		cell: (e) => (
			<Link href={"/patients/"+ e.getValue() + "?name=" + e.row.original.name} className="flex justify-center">
				<PlusCircleIcon width={24} height={24} className="text-primary-600"/>
			</Link>
		)
	},
];

