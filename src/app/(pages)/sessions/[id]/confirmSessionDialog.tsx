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
import { ReactNode, useState } from "react";

type ConfirmSessionDialogProps = {
  onConfirm: (paymentType: string) => void;
  triggerButton: ReactNode;
};

export function ConfirmSessionDialog({
  onConfirm,
  triggerButton,
}: ConfirmSessionDialogProps) {

  const [paymentType, setPaymentType] = useState('DINHEIRO')
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="md:w-[40vw]">
        <DialogHeader>
          <DialogTitle className="font-normal">Confirmar Sessão</DialogTitle>
          <DialogDescription>
            Informe a forma de pagamento
          </DialogDescription>
        </DialogHeader>
        <div className="mt-1 flex justify-end space-x-2">
          <select
            value={paymentType}
            onChange={e => setPaymentType(e.target.value)}
            className="border rounded p-2 w-full 
            border-r-8 border-transparent  outline outline-primary-400 ">
            <option value="DINHEIRO">Dinheiro</option>
            <option value="CARTAO">Cartão</option>
            <option value="TRANSFERENCIA">Transferência</option>
            <option value="PIX">PIX</option>
            {/* <option>Pendente</option> */}
          </select>
          <DialogClose asChild>
            <Button
              onClick={() => {
                onConfirm(paymentType);
              }}
              className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-600/70"
            >
              Confirmar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
