import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { getData } from "@/services/patientsService";

export default async function PatientsPage() {
	const data = await getData();
	return (
		<main className="flex h-full w-full items-center justify-center bg-white p-5 md:p-10">
			<DataTable
				columns={columns}
				data={data}
				linkTop={true}
				filteringColumn="name"
			/>
		</main>
	);
}
