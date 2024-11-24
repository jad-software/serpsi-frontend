import { ColumnDef, Table, flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "../ui/table";
interface bodyTableProps<TData, TValue> {
	table: Table<TData>;
	columns: ColumnDef<TData, TValue>[];
}
export function BodyTable<TData, TValue>({
	table,
	columns
}: bodyTableProps<TData, TValue>) {
	return (
		<TableBody>
			{table.getRowModel().rows?.length ? (
				table.getRowModel().rows.map((row) => (
					<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)}
								</TableCell>
							))}
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell
						colSpan={columns.length}
						className="h-24 text-center"
					>
						No results.
					</TableCell>
				</TableRow>
			)}
			{table.getRowModel().rows?.length < 10 &&
			table.getRowModel().rows?.length
				? Array.from({
						length: 10 - table.getRowModel().rows?.length
					}).map((it, index) => (
						<TableRow key={index} className="hover:bg-primary-50">
							<TableCell
								colSpan={columns.length}
								className="h-10"
							></TableCell>
						</TableRow>
					))
				: null}
		</TableBody>
	);
}
