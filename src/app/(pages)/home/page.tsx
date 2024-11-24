import WIP from "./wip.svg";
import Image from "next/image";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-around pt-16">
			<Image
				src={WIP}
				width={1920}
				height={1080}
				alt="Em construção!"
				className="w-1/3"
				loading="eager"
			/>
			<br />
			<br />
			<h1 className="w-4/5 text-center text-lg font-normal md:w-full md:text-xl">
				Tela em construção. Por favor, aguarde a próxima atualização!
			</h1>
		</main>
	);
}
