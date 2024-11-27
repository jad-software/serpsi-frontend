import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import CriarSessao from './criar-sessao.svg';
import psiImage from "/public/img/avatar.svg";

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
      <section className="w-[75vw] h-[80vh] border rounded-lg border-primary-600 flex 
        flex-row space-x-32 p-7">
        <div>
          <h1 className="text-primary-700">Informações do paciente:</h1>
          <section className="flex flex-col md:flex-row md:space-x-10 mt-10">
            <div>
              <Image
                className="mb-4 h-24 w-24 rounded-full"
                src={psiImage}
                alt="Profile"
                width={100}
                height={100}
                unoptimized
              />
            </div>
            <div>
              <p>Nome: Roberto Santos</p>
              <p>Data de Nascimento: 31/12/2000</p>
              <p>000.000.000-00</p>
              <p>Tel: (00) 00000-0000</p>
            </div>
            <div className="me-10">
              <p>Responsável: Roberta Mãe</p>
              <p>Data de Nascimento: 31/12/2000</p>
              <p>000.000.000-00</p>
              <p>Tel: (00) 00000-0000</p>
            </div>
          </section>
        </div>
        <div className="hidden lg:block ">
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
