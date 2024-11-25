import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { getPatientsData } from "@/services/patientsService";

export default async function SelectPatientsPage() {
	const data = await getPatientsData(true);
	return (
		<main className="flex h-full w-full items-center justify-center bg-white p-4">
			<DataTable
				columns={columns}
				data={data}
				linkTop={true}
				filteringColumn="name"
				filteringPlaceHolder="nome"
			/>
		</main>
	);
}
