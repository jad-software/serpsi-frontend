import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const roboto = Roboto({
	weight: ["400", "500", "700"],
	style: ["normal", "italic"],
	subsets: ["latin"],
	preload: false
});

export const metadata: Metadata = {
	title: "SerPsi",
	description: "Consultório Virtual de Psicologia"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-br">
			<body className={roboto.className}>
				{children}
				<Toaster closeButton richColors />
			</body>
		</html>
	);
}
