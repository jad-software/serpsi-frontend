import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import CriarSessao from './criar-sessao.svg';
import psiImage from "/public/img/avatar.svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function CreateSession() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-5 lg:px-10 bg-white">
      <div className="mb-4 w-full">
        <Link href={"/patients"} className="flex items-center text-gray-600">
          <ChevronLeftIcon className="w-6 h-6" />
          <span className="ml-2 text-lg font-medium">Agendar Sessões</span>
        </Link>
      </div>

      <section className="w-fullmax-w-screen-lg  rounded-lg border border-primary-400 p-5 lg:flex lg:space-x-10">

        <div className="flex-1">
          <h1 className="text-lg font-semibold text-primary-700 mb-6">Informações do paciente:</h1>
          <div className="flex flex-col items-center justify-center md:items-start md:flex-row md:space-x-10 mb-6">

            <div className="flex flex-col md:flex-row items-center md:items-start space-x-4 mb-2 md:mb-0">
              <Image
                src={psiImage}
                alt="Profile"
                width={100}
                height={100}
                className="h-24 w-24 rounded-full object-cover"
              />
              <div>
                <p>Nome: Roberto Santos</p>
                <p>Nascimento: 31/12/2000</p>
                <p>CPF: 000.000.000-00</p>
                <p>Tel: (00) 00000-0000</p>
              </div>
            </div>

            <div>
              <p>Responsável: Roberta Mãe</p>
              <p>Nascimento: 31/12/2000</p>
              <p>CPF: 000.000.000-00</p>
              <p>Tel: (00) 00000-0000</p>
            </div>
          </div>


          <h2 className="text-lg font-semibold text-primary-700 mb-4">Criar próximas sessões:</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label
                className="block text-gray-700 font-medium mb-2">
                Data da primeira sessão:
              </label>
              <input
                type="date"
                className="w-full h-11 rounded border 
                  border-primary-400 p-2 focus:ring focus:ring-primary-400"
              />
              <label
                className="block text-gray-700 font-medium mt-4 mb-2">
                Frequência das sessões:
              </label>
              <Select>
                <SelectTrigger
                  className="w-full h-11  border-primary-400 focus:ring focus:ring-primary-400">
                  <SelectValue placeholder="Selecione a frequência das sessões..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEMANAL">Semanal</SelectItem>
                  <SelectItem value="QUINZENAL">Quinzenal</SelectItem>
                  <SelectItem value="MENSAL">Mensal</SelectItem>
                </SelectContent>
              </Select>
              <label
                className="block text-gray-700 font-medium mt-4 mb-2">
                Valor da sessão:
              </label>
              <input
                type="text"
                placeholder="R$ 100,00"
                className="w-full h-11 rounded border border-primary-400 p-2 focus:ring focus:ring-primary-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Horário da primeira sessão:</label>
              <Select>
                <SelectTrigger className="w-full h-11 border-primary-400 focus:ring focus:ring-primary-400">
                  <SelectValue placeholder="Selecione o horário..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                </SelectContent>
              </Select>
              <label className="block text-gray-700 font-medium mt-4 mb-2">Número de sessões:</label>
              <input
                type="number"
                placeholder="10"
                className="w-full rounded border h-11 border-primary-400 p-2 focus:ring focus:ring-primary-400"
              />
              <label className="block text-gray-700 font-medium mt-4 mb-2">Forma de pagamento:</label>
              <Select disabled>
                <SelectTrigger className="w-full h-11 border-primary-400 focus:ring focus:ring-primary-400 bg-gray-100">
                  <SelectValue placeholder="A Definir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                  <SelectItem value="CARTAO">Cartão</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pb-10 w-full md:col-span-2 flex justify-center">
              {/* <div className="w-full flex items-center justify-center"> */}
              <Button
                // onClick={handleSubmit}
                className="rounded bg-primary-600 px-8 py-2 text-white hover:bg-primary-600/70"
              >
                Confirmar
              </Button>
              {/* </div> */}
            </div>
          </form>
        </div>

        <div className="hidden lg:flex items-center">
          <Image
            src={CriarSessao}
            alt="Imagem tela cadastro sessão"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </section>
    </main>
  );
}
