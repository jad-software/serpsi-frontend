import { DataTable } from "@/components/table/data-table";
import { columns, data } from "./columns";

export default async function PastSessionsPage({
	params
}: {
	params: { id: string };
}) {
	return (
		<main className="flex h-full w-full items-center justify-center bg-white p-4">
			<DataTable
				columns={columns}
				data={data}
				filteringColumn="schedule"
				filteringPlaceHolder="data"
			/>
		</main>
	);
}
