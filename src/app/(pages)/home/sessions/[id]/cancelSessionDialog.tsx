import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type CancelSessionDialogProps = {
	onCancel: () => void;
	triggerButton: ReactNode;
};

export function CancelSessionDialog({
	onCancel,
	triggerButton
}: CancelSessionDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerButton}</DialogTrigger>
			<DialogContent className="md:w-[40vw]">
				<DialogHeader>
					<DialogTitle className="font-normal">
						Cancelar Sessão
					</DialogTitle>
					<DialogDescription>
						Deseja realmente cancelar a sessão?
					</DialogDescription>
				</DialogHeader>
				<div className="mt-1 flex justify-end space-x-2">
					<DialogClose asChild>
						<Button
							onClick={() => {
								onCancel();
							}}
							className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600/70"
						>
							Sim
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-600/70">
							Não
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
