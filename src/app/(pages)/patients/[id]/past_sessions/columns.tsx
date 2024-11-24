"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PencilAltIcon } from "@heroicons/react/outline";

export type Session = {
	id: string;
	name: string;
	paymentType: "Transferência" | "PIX" | "Cartão" | "Dinheiro" | "Pendente";
	schedule: string;
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
		accessorKey: "name",
		header: "Paciente",
		size: 250
	},
	{
		accessorKey: "paymentType",
		header: "Forma de pagamento",
		cell: (e) => {
			let className =
				e.getValue() == "Pendente" ? "text-orange-600/70" : "";
			return <p className={className}>{e.getValue() as string}</p>;
		},
		size: 250
	},
	{
		accessorKey: "schedule",
		header: "Data da sessão",
		size: 250
	}
];

export const data: Session[] = [
	{
		id: "INV00",
		name: "Roberto Santos",
		paymentType: "PIX",
		schedule: "01/mm/aaaa HH:MM"
	},
	{
		id: "INV01",
		name: "Roberto Santos",
		paymentType: "PIX",
		schedule: "02/mm/aaaa HH:MM"
	},
	{
		id: "INV02",
		name: "Roberto Santos",
		paymentType: "Pendente",
		schedule: "03/mm/aaaa HH:MM"
	},
	{
		id: "INV03",
		name: "Roberto Santos",
		paymentType: "PIX",
		schedule: "dd/mm/aaaa HH:MM"
	},
	{
		id: "INV04",
		name: "Roberto Santos",
		paymentType: "PIX",
		schedule: "dd/mm/aaaa HH:MM"
	},
	{
		id: "INV05",
		name: "Roberto Santos",
		paymentType: "Pendente",
		schedule: "dd/mm/aaaa HH:MM"
	},
	{
		id: "INV06",
		name: "Roberto Santos",
		paymentType: "PIX",
		schedule: "dd/mm/aaaa HH:MM"
	},
	{
		id: "INV07",
		name: "Roberto Santos",
		paymentType: "PIX",
		schedule: "dd/mm/aaaa HH:MM"
	}
];

export const getData = () => {
	return data;
};
