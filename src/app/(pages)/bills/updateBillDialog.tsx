import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { InputText } from "@/components/form/InputText";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BillsColumns } from "./columns";
import { updateBills } from "@/services/billsService";
import { Row } from "@tanstack/react-table";
import { formatDateToddmmYYYY } from "@/services/utils/formatDate";

type updateBillDialogProps = {
	triggerButton: ReactNode;
	bills: Row<BillsColumns>[];
};

type UpdateBills = {
	bills: BillsColumns[];
	paymentDate: Date;
};

export function UpdateBillDialog({
	triggerButton,
	bills
}: updateBillDialogProps) {
	const updateBillsSchema = z.object({
		bills: z.array(
			z.object({
				id: z.string(),
				name: z.string().min(1, "Título é um campo obrigatório."),
				value: z.number().positive("O valor deve ser maior que 0"),
				dueDate: z
					.preprocess((val) => {
						return val === "" ? undefined : val;
					}, z.coerce.date().optional())
					.refine((val) => val !== undefined, {
						message: "Data de pagamento é obrigatória."
					})
			})
		),
		paymentDate: z
			.preprocess((val) => {
				return val === "" ? undefined : val;
			}, z.coerce.date().optional())
			.refine((val) => val !== undefined, {
				message: "Data de pagamento é obrigatória."
			})
	});

	const [isOpened, setOpen] = useState(false);
	const onSubmit = async (data: UpdateBills) => {
		console.log("data", data);
		const response = await updateBills(data.bills, data.paymentDate);
		// if (response?.error) {
		// 	toast.error("Algo de errado aconteceu.");
		// } else {
		toast.success("Conta criada com sucesso.");
		setOpen(false);
		// }
	};

	const methods = useForm<UpdateBills>({
		resolver: zodResolver(updateBillsSchema)
	});
	methods.setValue(
		"bills",
		bills.map((bill) => bill.original)
	);

	return (
		<>
			<Dialog open={isOpened} onOpenChange={setOpen}>
				<DialogTrigger asChild>{triggerButton}</DialogTrigger>
				<DialogContent className="lg:w-[40vw]">
					<DialogHeader>
						<DialogTitle className="font-normal text-primary-600">
							Definir pagamento
						</DialogTitle>
						<DialogDescription>
							Quer definir as contas a seguir como pagas?
						</DialogDescription>
					</DialogHeader>
					<form
						className="mt-1 flex flex-col justify-end gap-6"
						onSubmit={methods.handleSubmit(onSubmit, (data) => {
							console.log(data);
							toast.warning("Algo deu errado");
						})}
					>
						<div className="flex w-full gap-6">
							<div className="flex max-h-[300px] w-full flex-col overflow-auto">
								{bills.map((bill) => (
									<div
										key={bill.original.id}
										className="border-y border-primary-300"
									>
										<p>Título: {bill.original.name}</p>
										<p>
											Venc.:{" "}
											{formatDateToddmmYYYY(
												new Date(bill.original.dueDate)
											)}
										</p>
									</div>
								))}{" "}
							</div>
							<div className="flex w-full flex-col gap-4">
								<div>
									<InputText
										id="payment-date"
										label="Data de pagamento:"
										placeholder="dd/mm/aaaa"
										type="date"
										name="paymentDate"
										register={methods.register}
									/>
								</div>
							</div>
						</div>
						<div className="flex w-full justify-end gap-4">
							<Button
								className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600/70"
								type="submit"
							>
								Confirmar
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
