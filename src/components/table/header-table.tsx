import { Table, flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "../ui/table";

interface headerTableProps<TData> {
	table: Table<TData>;
}
export function HeaderTable<TData>({ table }: headerTableProps<TData>) {
	return (
		<TableHeader className="h-[80px] bg-primary-100 text-lg font-bold">
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id} className="hover:bg-primary-100">
					{headerGroup.headers.map((header) => {
						return (
							<TableHead
								key={header.id}
								className={`w-[${header.getSize()}px] ${header.index === 0 ? "px-2" : ""}`}
							>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
}
