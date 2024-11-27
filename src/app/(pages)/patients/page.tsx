import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { getPatientsData } from "@/services/patientsService";
import Link from "next/link";

export default async function PatientsPage() {
	const data = await getPatientsData();
	return (
		<main className="flex h-full w-full items-center justify-center bg-white p-4">
			<DataTable
				columns={columns}
				data={data}
				linkTop={
					<section>
						<Link
							href="/patients/register"
							className="text-sm font-medium text-primary-600 underline"
						>
							Cadastrar novo paciente
						</Link>
					</section>
				}
				filteringColumn="name"
				filteringPlaceHolder="nome"
			/>
		</main>
	);
}
