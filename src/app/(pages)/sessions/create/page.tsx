import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import CriarSessao from './criar-sessao.svg';
import psiImage from "/public/img/avatar.svg";
import { InputText } from "@/components/form/InputText";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <section className="w-[75vw] h-[75vh] border rounded-lg border-primary-600 flex 
        flex-row space-x-32 p-7">
        <div>
          <h1 className="text-primary-700">Informações do paciente:</h1>
          <section className="flex flex-col space-y-10">
            <div className=" flex flex-col md:flex-row md:space-x-20 mt-10">
              <div className="flex flex-col md:flex-row space-x-4">
                <Image
                  className="mb-4 h-24 w-24 rounded-full"
                  src={psiImage}
                  alt="Profile"
                  width={100}
                  height={100}
                  unoptimized
                />
                <div>
                  <p>Nome: Roberto Santos</p>
                  <p>Data de Nascimento: 31/12/2000</p>
                  <p>000.000.000-00</p>
                  <p>Tel: (00) 00000-0000</p>
                </div>
              </div>

              <div>
                <p>Responsável: Roberta Mãe</p>
                <p>Data de Nascimento: 31/12/2000</p>
                <p>000.000.000-00</p>
                <p>Tel: (00) 00000-0000</p>
              </div>
            </div>
            <div>
              <h1 className="text-primary-700">Criar próximas sessões:</h1>
              <form className="flex flex-col md:flex-row md:space-x-20 mt-5">
                <div>
                  <label
                    className="mb-2 text-gray-900 block"
                    htmlFor="valor-sessao"
                  >
                    Data da primeira sessão:
                  </label>
                  <input
                    id="valor-sessao"
                    type="Date"
                    className="w-[75%] rounded border border-r-8 border-transparent p-2 outline outline-primary-400 "
                  />
                  <label
                    className="mb-2 text-gray-900 block mt-5"
                    htmlFor="forma-pagamento"
                  >
                    Frequência das sessões:
                  </label>
                  <Select
                  >
                    <SelectTrigger
                      className={
                        "w-[75%] border-primary-400 focus:ring-primary-500 h-11"
                      }
                    >
                      <SelectValue placeholder="Selecione a frequência das sessões..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEMANAL">
                        Semanal
                      </SelectItem>
                      <SelectItem value="QUINZENAL">
                        Quinzenal
                      </SelectItem>
                      <SelectItem value="MENSAL">
                        Mensal
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <label
                    className="mb-2 text-gray-900 block mt-5"
                    htmlFor="valor-sessao"
                  >
                    Valor da sessão:
                  </label>
                  <input
                    id="valor-sessao"
                    type="text"
                    className="w-[75%] rounded border border-r-8 border-transparent p-2 outline outline-primary-400 "
                    placeholder="R$ 100,00"
                  />
                </div>
                <div>
                <label
                    className="mb-2 text-gray-900 block"
                    htmlFor="forma-pagamento"
                  >
                    Horário da primeira sessão:
                  </label>
                  <Select
                  >
                    <SelectTrigger
                      className={
                        "w-full border-primary-400 focus:ring-primary-500 h-11"
                      }
                    >
                      <SelectValue placeholder="Selecione o horário..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">
                        08:00
                      </SelectItem>
                      <SelectItem value="09:00">
                        09:00
                      </SelectItem>
                      <SelectItem value="10:00">
                        10:00
                      </SelectItem>
                      <SelectItem value="11:00">
                        11:00
                      </SelectItem>
                      <SelectItem value="12:00">
                        12:00
                      </SelectItem>
                    </SelectContent>
                  </Select>
                <label
                    className="mb-2 text-gray-900 block mt-10"
                    htmlFor="valor-sessao"
                  >
                    Número de sessões:
                  </label>
                  <input
                    id="valor-sessao"
                    type="number"
                    className="w-full rounded border border-r-8 border-transparent p-2 outline outline-primary-400 "
                    placeholder={"10"}
                  />


                </div>
              </form>
              <div>
                
              </div>
            </div>
          </section>
        </div>
        <div className="hidden lg:block ">
          <Image
            src={CriarSessao}
            width={400}
            height={400}
            alt="Imagem tela cadastro sessão"
            className="h-auto w-auto"
            loading="eager"
          />
        </div>
      </section>
    </main>
  )
}
