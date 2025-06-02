import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { usePathname, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

type TRoute = {
	title: string;
	link: string;
};

// Title of the route that will appear in the BreadCrumb
const routeTitles: { [key: string]: string } = {
	home: "Início",
	patients: "Meus pacientes",
	schedule: "Agenda",
	register: "Cadastro",
	documents: "Documentos",
	bills: "Financeiro",
	"schedule-definer": "Minha agenda",
	"past-sessions": "Histórico de sessões",
	"select-patient": "Selecionar paciente",
	profile: "Meus dados",
	sessions: "Sessões"
};

const BreadcrumbContent = () => {
	const urlpath: string = usePathname();
	const searchParams = useSearchParams();

	const getCrumbs = (): TRoute[] => {
		const parts = urlpath.split("/").filter(Boolean);

		var crumbs: TRoute[] = parts.map((part, index) => {
			const link = "/" + parts.slice(0, index + 1).join("/");

			if (
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
					part
				) &&
				searchParams.get("name")
			) {
				return {
					title: searchParams.get("name") || part,
					link
				};
			}

			const title = routeTitles[part] || part;
			return { title, link };
		});

		if (
			!crumbs.some(
				(crumb) => crumb.title === "Início" && crumb.link === "/home"
			)
		) {
			crumbs = [{ title: "Início", link: "/home" }, ...crumbs];
		}

		return crumbs;
	};

	const crumbs = getCrumbs();

	return (
		<Breadcrumb>
			<BreadcrumbList className="font-medium text-gray-600">
				{crumbs.map((value, key) => (
					<React.Fragment key={key}>
						<BreadcrumbItem>
							{key < getCrumbs().length - 1 ? (
								<BreadcrumbLink href={value.link}>
									{value.title}
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage className="font-medium text-primary-700">
									{value.title}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{key < getCrumbs().length - 1 ? (
							<BreadcrumbSeparator>
								<ChevronRightIcon />
							</BreadcrumbSeparator>
						) : null}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

// Main component with Suspense wrapper
export default function NavigationBreadcrumb() {
	return (
		<Suspense fallback={<div>Carregando...</div>}>
			<BreadcrumbContent />
		</Suspense>
	);
}
