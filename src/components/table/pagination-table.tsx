import {
	Pagination,
	PaginationContent,
	PaginationItem
} from "../ui/pagination";

import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { Input } from "../ui/input";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
interface paginationTableProps<TData> {
	table: Table<TData>;
}
export function PaginationTable<TData>({ table }: paginationTableProps<TData>) {
	const [pageIndex, setPageIndex] = useState(1);
	const changePage = (newPage: number) => {
		setPageIndex(newPage);
		table.setPageIndex(newPage - 1);
	};

	const nextPage = () => {
		setPageIndex((prev) => prev + 1);
		table.nextPage();
	};

	const previousPage = () => {
		setPageIndex((prev) => prev - 1);
		table.previousPage();
	};
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<Button
						variant="link"
						onClick={() => previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="text-primary-600 disabled:text-gray-500"
					>
						<ChevronLeftIcon className="h-4 w-4" />
					</Button>
				</PaginationItem>
				<PaginationItem className="flex items-center gap-1 text-primary-600">
					<span>Página</span>
					<Input
						id="pagination"
						className="mx-2 inline w-8 rounded-xl text-gray-500"
						onKeyDown={(e) => {
							e.key === "Enter"
								? changePage(Number(e.currentTarget.value))
								: null;
						}}
						onChange={(e) => setPageIndex(Number(e.target.value))}
						value={pageIndex}
					/>
					<span>de</span>
					{table.getPageCount()}
				</PaginationItem>
				<PaginationItem>
					<Button
						variant="link"
						onClick={() => nextPage()}
						disabled={!table.getCanNextPage()}
						className="text-primary-600 disabled:text-gray-500"
					>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
