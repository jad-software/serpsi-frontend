import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { getData } from "@/services/documentsService";

export default async function Documents() {
	const data = await getData();
	return (
		<main className="flex h-full w-full items-center justify-center bg-white p-3">
			<DataTable columns={columns} data={data!} filteringColumn="name" filteringPlaceHolder="nome" />
		</main>
	);
}
