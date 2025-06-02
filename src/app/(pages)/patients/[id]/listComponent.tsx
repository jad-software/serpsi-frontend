import { DownloadIcon } from "@heroicons/react/outline";
import classNames from "classnames";

interface ListComponentProps {
	content: string;
	id: string;
	variant?: "IsFirst" | "NotFirst";
	link: string;
}

const ListComponent = ({ content, id, variant, link }: ListComponentProps) => {
	const listComponentClass = classNames(" mb-1 border-blue-500 p-1", {
		"border-y-2 ": variant === "IsFirst",
		"border-b-2": variant === "NotFirst"
	});
	return (
		<li className={listComponentClass}>
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				className="flex justify-between text-gray-900"
			>
				{content}
				<DownloadIcon className="h-6 min-w-6" />
			</a>
		</li>
	);
};

export { ListComponent };
