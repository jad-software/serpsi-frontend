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
import { useEffect, useState } from "react";
import { DocumentViewer } from "react-documents";

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
				<div className="flex h-[80vh] w-full flex-col items-end justify-center gap-2">
					<DocumentViewer
						queryParams="hl=pt"
						style={{ width: "100%", height: "100%" }}
						url={url}
					/>
					<Button
						variant="link"
						className="gap-2 text-primary-600"
						onClick={() => DownloadFile(url, title)}
					>
						Baixar arquivo <DownloadIcon className="h-6 w-6" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
