"use client"
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import CriarSessao from './criar-sessao.svg';
import psiImage from "/public/img/avatar.svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputMask from "react-input-mask-next";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, FormProvider, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

const sessionSchema = z.object({
  startDate: z
  .string()
  .min(1, "A data da primeira sessão é obrigatória.")
  .refine(
    (value) => {
      const [year, month, day] = value.split("-").map(Number);
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return inputDate.getTime() >= today.getTime();
    },
    {
      message: "A data não pode estar no passado.",
    }
  ),
  frequency: z.string().min(1, "A frequência da Sessão é obrigatória"),
  sessionValue: z
    .string()
    .regex(
      /^R\$ (\d{1,3}(\.\d{3})*|\d+),\d{2}$/,
      "O valor da sessão é obrigatório"
    ).refine(
      (value) => {
        const numericValue = parseFloat(value.replace(/[^\d]/g, "")) / 100;
        return numericValue > 0;
      },
      {
        message: "O valor da sessão deve ser maior que R$ 0",
      }
    ),
  startTime: z.string().min(1, "O horário da sessão é obrigatório."),
  sessionCount: z.number().positive("O número de sessões deve ser maior que zero."),
  paymentMethod: z.string().optional(),
});

type SessionData = z.infer<typeof sessionSchema>;


export default function CreateSession() {

  const methods = useForm<SessionData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      startDate: "",
      frequency: "",
      sessionValue: "",
      startTime: "",
      sessionCount: 1,
      paymentMethod: "",
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState, control, setValue } = methods;
  const { errors } = formState;


  const formatToCurrency = (value: string) => {
    if (!value) return "R$ 0,00";
    const numericValue = value.replace(/[^\d]/g, "");
    const num = parseFloat(numericValue) / 100;
    return `R$ ${num.toFixed(2).replace(".", ",")}`;
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const formattedValue = formatToCurrency(rawValue);
    setValue("sessionValue", formattedValue, { shouldValidate: true });
  };

  const onSubmit = (data: SessionData) => {
    console.log("Form Data:", data);
  };

  return (
    <main className="flex flex-col items-center justify-center px-4 py-5 lg:px-10 bg-white">
      <div className="mb-4 w-full">
        <Link href={"/patients"} className="flex items-center text-gray-500">
          <ChevronLeftIcon className="w-6 h-6" />
          <span className="ml-2 text-lg ">Agendar Sessões</span>
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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Data da primeira sessão:
                </label>
                <input
                  type="date"
                  {...register("startDate")}
                  className={`w-full h-11 rounded border ${errors.startDate ? 'border-red-500' : 'border-primary-400'} p-2 focus:ring`}
                />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}

                <label className="block text-gray-700 font-medium mt-4 mb-2">
                  Frequência das sessões:
                </label>

                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={
                        field.onChange
                      }
                      value={
                        field.value
                      }
                    >
                      <SelectTrigger
                        className={
                          errors
                            .frequency
                            ? "w-full h-11 border-red-500 focus:ring-red-600"
                            : "w-full h-11 border-primary-400 focus:ring-primary-500"
                        }
                      >
                        <SelectValue placeholder="Selecione a frequência das sessões..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEMANAL">Semanal</SelectItem>
                        <SelectItem value="QUINZENAL">Quinzenal</SelectItem>
                        <SelectItem value="MENSAL">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.frequency && <p className="text-sm text-red-500">{errors.frequency.message}</p>}

                <label className="block text-gray-700 font-medium mt-4 mb-2">
                  Valor da sessão:
                </label>
                <input
                  type="text"
                  {...register("sessionValue")}
                  onChange={handleCurrencyChange}
                  placeholder="R$ 0,00"
                  className={`w-full h-11 rounded border ${errors.sessionValue ? "border-red-500" : "border-primary-400"
                    } p-2 focus:ring`}
                />
                {errors.sessionValue && (
                  <p className="text-sm text-red-500">{errors.sessionValue.message}</p>
                )}


              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Horário da primeira sessão:
                </label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={
                        field.onChange
                      }
                      value={
                        field.value
                      }
                    >
                      <SelectTrigger
                        className={
                          errors
                            .startTime
                            ? "w-full h-11 border-red-500 focus:ring-red-600"
                            : "w-full h-11 border-primary-400 focus:ring-primary-500"
                        }
                      >
                        <SelectValue placeholder="Selecione o horário..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}

                <label className="block text-gray-700 font-medium mt-4 mb-2">
                  Número de sessões:
                </label>
                <input
                  type="number"
                  {...register("sessionCount", { valueAsNumber: true })}
                  placeholder="10"
                  className={`w-full h-11 rounded border ${errors.sessionCount ? 'border-red-500' : 'border-primary-400'} p-2 focus:ring`}
                />
                {errors.sessionCount && <p className="text-sm text-red-500">{errors.sessionCount.message}</p>}

                <label className="block text-gray-700 font-medium mt-4 mb-2">
                  Forma de pagamento:
                </label>
                <Select {...register("paymentMethod")} disabled>
                  <SelectTrigger className="w-full h-11 focus:ring bg-gray-100">
                    <SelectValue placeholder="A Definir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="CARTAO">Cartão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pb-10 w-full md:col-span-2 flex justify-center">
                <Button type="submit" className="rounded bg-primary-600 px-8 py-2 text-white hover:bg-primary-600/70">
                  Confirmar
                </Button>
              </div>
            </form>
          </FormProvider>
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
