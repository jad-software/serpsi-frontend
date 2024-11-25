import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { getSessions } from "@/services/meetingsService";

export default async function PastSessionsPage({
	params
}: {
	params: { id: string };
}) {
	const data = await getSessions(params.id);
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
