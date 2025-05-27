import classNames from "classnames";
import { useRef } from "react";
import { useClickOutside, useMediaQuery } from 'react-haiku';

export default function NavigationSideBar({
	children,
	isHidden,
	setIsHidden = () => { }
}: Readonly<{
	children: React.ReactNode;
	isHidden: boolean;
	setIsHidden?: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
	const asideClassName = classNames(
		"fixed top-14 z-50 min-w-full bg-white sm:flex sm:h-full sm:min-w-16",
		{ "hidden ": isHidden }
	);
	const isMobile = useMediaQuery("(max-width: 640px)", false);
	const handleClickOutside = () => isMobile && setIsHidden(true) ;
	const ref = useRef(null)
	useClickOutside(ref, handleClickOutside);

	return (
		<aside className={asideClassName} ref={ref}>
			<nav className="flex w-full flex-col">{children}</nav>
		</aside>
	);
}
