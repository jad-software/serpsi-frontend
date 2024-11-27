import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import CriarSessao from './criar-sessao.svg';

export default function CreateSession() {
  return (
    <main className="flex flex-col items-center justify-center bg-cover px-10 py-5">
      <div className="mb-2 flex w-full">
        <Link href={"/patients"} className="flex">
          <ChevronLeftIcon
            width={24}
            height={24}
            className="text-gray-500"
          />
          &nbsp;
          <span className="text-gray-900">Agendar Sessões</span>
        </Link>
      </div>
      <section className="w-[75vw] h-[80vh] border p-6 rounded-lg border-primary-600 flex flex-row space-x-80">
        <div>
          <h1>Informações do paciente:</h1>
        </div>
        <div className="hidden lg:block">
          <Image
            src={CriarSessao}
            width={391}
            height={391}
            alt="Em construção!"
            className="h-auto w-[391px]"
            loading="eager"
          />
        </div>
      </section>
    </main>
  )
}
