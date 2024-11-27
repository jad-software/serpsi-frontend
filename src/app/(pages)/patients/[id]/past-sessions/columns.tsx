"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PencilAltIcon } from "@heroicons/react/outline";
import { formatDateToddmmYYYYHHMM } from "@/services/utils/formatDate";

export type Session = {
	id: string;
	person_name: string;
	paymentType?: "Transferência" | "PIX" | "Cartão" | "Dinheiro" | "Pendente";
	meeting_status: "CONFIRMADO" | "CANCELADO" | "ABERTO" | "CREDITO";
	meeting_schedule: string;
};

export const columns: ColumnDef<Session>[] = [
	{
		accessorKey: "id",
		header: () => <div className="flex w-[70px] justify-center"></div>,
		size: 70,
		cell: (e) => (
			<Link
				href={"/patients/" + e.getValue()}
				className="flex justify-center"
			>
				<PencilAltIcon width={24} height={24} />
			</Link>
		)
	},
	{
		accessorKey: "person_name",
		header: "Paciente",
		size: 250
	},
	{
		accessorKey: "paymentType",
		header: "Forma de pagamento",
		cell: (e) => {
			let className =
				e.getValue() == "Pendente" ? "text-orange-600/70" : "";
			return e.getValue() as string ? <p className={className}>{e.getValue() as string}</p> : <p>-</p>;
		},
		size: 250
	},
	{
		accessorKey: "meeting_status",
		header: "Status",
		size: 250
	},
	{
		accessorKey: "meeting_schedule",
		header: "Data da sessão",
		cell: (e) => (
			<div className="">{formatDateToddmmYYYYHHMM(new Date(e.getValue() as string))}</div>
		),
		size: 250,
		filterFn: (row, id, filterValue) => {
			const date = formatDateToddmmYYYYHHMM(row.getValue(id));
			console.log(row.getValue(id))
			return date.includes(filterValue);
		}
	}
];