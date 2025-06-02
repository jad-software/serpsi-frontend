import { Button } from "@/components/ui/button";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType } from "react";

interface NavigationLinkProps {
	link: string;
	title: string;
	collapsed: boolean;
	Icon: ElementType<React.ComponentProps<"svg">>;
}

export default function NavigationLink({
	link,
	title,
	Icon,
	collapsed
}: NavigationLinkProps) {
	const urlpath = usePathname();

	const linkClassName = classNames(
		"flex w-full items-center justify-start p-2 ",
		{
			"bg-primary-200": urlpath.includes(link),
			"min-w-48": !collapsed
		}
	);

	return (
		<div className={linkClassName}>
			<Button
				variant={"ghost"}
				asChild
				className="flex w-full justify-start hover:bg-primary-200"
			>
				<Link href={link}>
					<Icon height={24} width={24} />
					{collapsed ? "" : <>&nbsp;{title}</>}
				</Link>
			</Button>
		</div>
	);
}
