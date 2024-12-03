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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BillsColumns } from "./columns";
import { updateManyBills } from "@/services/billsService";
import { Row } from "@tanstack/react-table";
import { formatDateToddmmYYYY } from "@/services/utils/formatDate";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";

type updateManyBillDialogProps = {
	triggerButton: ReactNode;
	bills: Row<BillsColumns>[];
};

type UpdateBills = {
	bills: BillsColumns[];
	paymentDate: Date;
	paymentType: string;
};

export function UpdateManyBillDialog({
	triggerButton,
	bills
}: updateManyBillDialogProps) {
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
		paymentType: z
			.string()
			.min(5, "Tipo é um campo obrigatório.")
			.transform((val) => val?.toUpperCase()),
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
		const response = await updateManyBills(data.bills, data.paymentDate);
		// if (response?.error) {
		// 	toast.error("Algo de errado aconteceu.");
		// } else {
		toast.success("Contas atualizadas com sucesso.");
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
						<section className="flex w-full gap-6">
							<div className="flex max-h-[200px] w-full flex-col overflow-auto">
								{bills.map((bill) => (
									<div
										key={bill.original.id}
										className="border-y border-primary-300"
									>
										<h2>Título: {bill.original.name}</h2>
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
								<div>
									<label
										htmlFor="paymentType"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Forma de pagamento:
									</label>
									<Controller
										name="paymentType"
										control={methods.control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger
													className={
														"w-full border-primary-600 focus:ring-primary-500"
													}
												>
													<SelectValue placeholder="Selecione a forma de pagamento  " />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="PIX">
														Pix
													</SelectItem>
													<SelectItem value="TRANSFERÊNCIA">
														Transferência
													</SelectItem>
													<SelectItem value="CARTAO">
														Cartão
													</SelectItem>
													<SelectItem value="DINHEIRO">
														Dinheiro
													</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
								</div>
							</div>
						</section>
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
