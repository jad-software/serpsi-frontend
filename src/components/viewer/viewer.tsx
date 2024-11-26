"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { DownloadFile } from "@/services/utils/downloadFile";
import { DownloadIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { DocumentViewer } from "react-documents";
import Markdown from "./markdownViewer";

export default function Viewer({
	children,
	link,
	title,
	className
}: {
	children: React.ReactNode;
	link: string;
	title: string;
	className?: string;
}) {
	let [url, setUrl] = useState("");
	useEffect(() => {
		async function getUrlFromDocument(link: string) {
			setUrl(link);
		}
		getUrlFromDocument(link);
	}, [link]);

	return (
		<Dialog>
			<DialogTrigger className={className}>{children}</DialogTrigger>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle className="font-medium">{title}</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<section className="flex h-[80vh] w-full flex-col items-end justify-center gap-2">
					{url.includes("image") ? (
						<Image
							src={url}
							alt="imagem sobre a sessão"
							width={450}
							height={450}
							className="h-full w-full object-contain p-4"
						/>
					) : url.includes(".md") ? (
						<Suspense fallback={<>Carregando...</>}>
							<Markdown url={url} className="flex-col "/>
						</Suspense>
					) : (
						<DocumentViewer
							queryParams="hl=pt"
							style={{ width: "100%", height: "100%" }}
							url={url}
						/>
					)}

					<Button
						variant="link"
						className="gap-2 text-primary-600"
						onClick={() => DownloadFile(url, title)}
					>
						Baixar arquivo <DownloadIcon className="h-6 w-6" />
					</Button>
				</section>
			</DialogContent>
		</Dialog>
	);
}
