import { cn } from "@/lib/utils";
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

	return (
		<article className="flex h-full w-full overflow-auto">
			<ReactMarkdown className={cn(className) + "prose md:prose-base prose-a:text-blue-600 prose-a:underline prose-headings:font-bold prose-ul:list-disc"} skipHtml >
				{markdownContent}
			</ReactMarkdown>
		</article>
	);
}

export default Markdown;
