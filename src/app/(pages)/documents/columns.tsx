"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentTextIcon } from "@heroicons/react/outline";
import Viewer from "@/components/viewer/viewer";

export type DocumentColumns = {
	id: string;
	title: string;
	docLink: string;
	name: string;
	createDate: string;
}


export const columns: ColumnDef<DocumentColumns>[] = [
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
		accessorKey: "viewer",
		header: "",
		size: 70,
		cell: ({ row }) => (
				<Viewer
					link={row.original.docLink}
					title={row.original.name + " - " + row.original.title}
					className=""
				>
					<DocumentTextIcon
						width={24}
						height={24}
						className="text-primary-600"
					/>
				</Viewer>
		)
	},
	{
		accessorKey: "name",
		header: "Paciente",
		size: 250
	},
	{
		accessorKey: "title",
		header: "Titulo",
		size: 250
	},
	{
		accessorKey: "createDate",
		header: "Data da sessão",
		size: 250
	}
];
