"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";

const sessionSchema = z.object({
  paymentMethod: z.string().min(1, "Forma de pagamento é obrigatória."),
  sessionValue: z
    .string()
    .regex(
      /^R\$ (\d{1,3}(\.\d{3})*|\d+),\d{2}$/,
      "O valor da sessão deve ser um valor monetário válido."
    )
    .refine(
      (value) => {
        const numericValue = parseFloat(value.replace(/[^\d]/g, "")) / 100;
        return numericValue > 0;
      },
      {
        message: "O valor da sessão deve ser maior que R$ 0,00.",
      }
    ),
  startDate: z
    .string()
    .refine(
      (value) => {
        const [year, month, day] = value.split("-").map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inputDate >= today;
      },
      {
        message: "A data não pode estar no passado.",
      }
    ),
  startTime: z.string().min(1, "O horário da sessão é obrigatório."),
});

type SessionData = z.infer<typeof sessionSchema>;

export function EditSessionDialog({
  triggerButton,
  defaultValues,
  onSubmit,
}: {
  triggerButton: React.ReactNode;
  defaultValues: SessionData;
  onSubmit: (data: SessionData) => void;
}) {
  const methods = useForm<SessionData>({
    resolver: zodResolver(sessionSchema),
    defaultValues,
  });

  const { register, handleSubmit, control, formState, setValue } = methods;
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

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-full max-w-[50vw]">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-primary-700">
                Editar sessão
              </DialogTitle>
              <DialogDescription>
                <p className="text-sm text-gray-500">
                  Preencha os dados para editar a sessão.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Forma de pagamento */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Forma de pagamento:
                </label>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full h-11 border-primary-400">
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                        <SelectItem value="CARTAO">Cartão</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentMethod && (
                  <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Valor da sessão */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Valor da sessão:
                </label>
                <input
                  type="text"
                  {...register("sessionValue")}
                  onChange={handleCurrencyChange}
                  placeholder="R$ 0,00"
                  className={`w-full h-11 rounded border ${errors.sessionValue ? "border-red-500" : "border-primary-400"
                    } p-2`}
                />
                {errors.sessionValue && (
                  <p className="text-sm text-red-500">{errors.sessionValue.message}</p>
                )}
              </div>

              {/* Data da sessão */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Data da sessão:
                </label>
                <input
                  type="date"
                  {...register("startDate")}
                  className={`w-full h-11 rounded border ${errors.startDate ? "border-red-500" : "border-primary-400"
                    } p-2`}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate.message}</p>
                )}
              </div>

              {/* Horário da sessão */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Horário da sessão:
                </label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full h-11 border-primary-400">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.startTime && (
                  <p className="text-sm text-red-500">{errors.startTime.message}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <DialogClose asChild>
                <Button
                  type="submit"
                  className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-600/70"
                >
                  Confirmar
                </Button>
              </DialogClose>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
