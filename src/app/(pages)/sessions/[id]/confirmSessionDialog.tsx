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
import { ReactNode } from "react";

type ConfirmSessionDialogProps = {
  onConfirm: () => void;
  triggerButton: ReactNode;
};

export function ConfirmSessionDialog({
  onConfirm,
  triggerButton,
}: ConfirmSessionDialogProps) {

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
          <select className="border rounded p-2 w-full 
            border-r-8 border-transparent  outline outline-primary-400 ">
            <option>Dinheiro</option>
            <option>Cartão</option>
            <option>PIX</option>
            <option>Transferência</option>
            <option>Pendente</option>
          </select>
          <DialogClose asChild>
            <Button
              onClick={() => {
                onConfirm();
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
