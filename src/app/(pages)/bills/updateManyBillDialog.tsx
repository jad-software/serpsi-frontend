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
	onSuccess?: () => void;
};

type UpdateBills = {
	_bills: BillsColumns[];
	_paymentMethod: {
		_paymentDate: Date;
		_paymentType: string;
	}
};

export function UpdateManyBillDialog({
	triggerButton,
	bills,
	onSuccess
}: updateManyBillDialogProps) {
	const updateBillsSchema = z.object({
		_bills: z.array(
			z.object({
				_id: z.object({ _id: z.string() }),
				_title: z.string().min(1, "Título é um campo obrigatório."),
				_amount: z.number().positive("O valor deve ser maior que 0"),
				_dueDate: z
					.preprocess((val) => {
						return val === "" ? undefined : val;
					}, z.coerce.date().optional())
					.refine((val) => val !== undefined, {
						message: "Data de pagamento é obrigatória."
					})
			})
		),
		_paymentMethod: z.object({
			_paymentType: z
				.string()
				.min(2, "Tipo é um campo obrigatório.")
				.optional()
				.transform((val) => val?.toUpperCase()),
			_paymentDate: z.preprocess((val) => {
				return val === "" ? undefined : val;
			}, z.coerce.date().optional())
		})
	});

	const [isOpened, setOpen] = useState(false);
	const onSubmit = async (data: UpdateBills) => {
		try {
			await updateManyBills(data._bills, data._paymentMethod);
			toast.success("Contas atualizadas com sucesso.");
			setOpen(false);
			onSuccess?.();
		}
		catch (error) {
			toast.error("Erro ao atualizar conta.");
			console.log(error);
		}
	};

	const methods = useForm<UpdateBills>({
		resolver: zodResolver(updateBillsSchema)
	});
	methods.setValue(
		"_bills",
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
						className="flex flex-col justify-end gap-6 max-w-[100%]"
						onSubmit={methods.handleSubmit(onSubmit, (data) => {
							console.log(data);
							toast.warning("Algo deu errado");
						})}
					>
						<section className="flex flex-col md:flex-row gap-6 ">
							<div className="flex max-h-[200px] w-full flex-col overflow-auto">
								{bills.map((bill) => (
									<div
										key={bill.original._id._id}
										className="border-y border-primary-300"
									>
										<h2>Título: {bill.original._title}</h2>
										<p>
											Venc.:{" "}
											{formatDateToddmmYYYY(
												bill.original._dueDate
											)}
										</p>
									</div>
								))}
							</div>
							<section className="flex w-full flex-col gap-4">
								<div>
									<InputText
										id="payment-date"
										label="Data de pagamento:"
										placeholder="dd/mm/aaaa"
										type="date"
										name="_paymentMethod._paymentDate"
										register={methods.register}
									/>
								</div>
								<div>
									<label
										htmlFor="_paymentMethod._paymentType"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Forma de pagamento:
									</label>
									<Controller
										name="_paymentMethod._paymentType"
										control={methods.control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger
													className={
														"border-primary-600 focus:ring-primary-500"
													}
												>
													<SelectValue placeholder="Selecione a forma de pagamento  " />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="PIX">
														Pix
													</SelectItem>
													<SelectItem value="TRANSFERENCIA">
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
							</section>
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
