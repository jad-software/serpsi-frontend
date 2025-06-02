"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PencilAltIcon } from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/solid";

export type Patient = {
	id: string;
	name: string;
	// payment_plan: "Mensal" | "Bimestral" | "Trimestral" | "Avulso";
	count_meetings: string;
	count_credits: string;
	documento: string;
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
		header: () => (
			<div className="flex items-center justify-center">
				Qtd Sessões Restantes
			</div>
		),

		cell: ({ row }) => {
			const value: string = row.getValue("count_meetings");
			const creditsValues: string = row.original.count_credits;
			return (
				<div className="text-center">
					{value} {<br />}{" "}
					{+creditsValues > 0 &&
						`( ${creditsValues} ${+creditsValues > 1 ? "creditos" : "credito"})`}
				</div>
			);
		},
		size: 250
	},
	{
		accessorKey: "id",
		header: () => (
			<div className="flex justify-center">Agendar Sessões</div>
		),
		size: 70,
		cell: (e) => (
			<Link
				href={"/home/sessions/create/" + "?id=" + e.row.original.id}
				className="flex justify-center"
			>
				<PlusCircleIcon width={24} height={24} color="#303F9F" />
			</Link>
		)
	}
];
