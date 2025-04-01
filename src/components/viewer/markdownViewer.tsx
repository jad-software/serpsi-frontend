import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";


function Markdown({ url, className }: { url: string; className: string }) {
	const [markdownContent, setMarkdownContent] = useState("");

	useEffect(() => {
		fetch(url)
			.then((response) => response.text())
			.then((text) => {
				setMarkdownContent(text);
			});
	}, [url]);

	function decodeBase64Image(base64: string) {
		const byteCharacters = atob(base64.split(",")[1]);
		const byteNumbers = new Array(byteCharacters.length)
			.fill(0)
			.map((_, i) => byteCharacters.charCodeAt(i));
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: base64.match(/data:(.*);base64/)?.[1] });
		return URL.createObjectURL(blob);
	}

	return (
		<article className="flex h-full w-full overflow-auto">
			<div
				className={cn(className) + "prose md:prose-base prose-a:text-blue-600 prose-a:underline prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal"}
				dangerouslySetInnerHTML={{ __html: markdownContent }}
			/>
		</article>
	);
}

export default Markdown;
