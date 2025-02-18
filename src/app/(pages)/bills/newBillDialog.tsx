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
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import { BillsColumns } from "./columns";
import { setBills } from "@/services/billsService";

type newBillDialogProps = {
	triggerButton: ReactNode;
	onSuccess?: () => void;
};

export function NewBillDialog({ triggerButton, onSuccess }: newBillDialogProps) {
	const [value, setValue] = useState(0);
	const [isOpened, setOpen] = useState(false);
	const billsSchema = z.object({
		_title: z.string().min(1, "Título é um campo obrigatório."),
		_amount: z.number().positive("O valor deve ser maior que 0"),
		_billType: z
			.string()
			.min(5, "Tipo é um campo obrigatório.")
			.transform((val) => val.toUpperCase()),
		_dueDate: z
			.preprocess((val) => {
				return val === "" ? undefined : val;
			}, z.coerce.date().optional())
			.refine((val) => val !== undefined, {
				message: "Data de vencimento é obrigatória."
			})
	});

	const onSubmit = async (data: BillsColumns) => {
		const response = await setBills(data);
		try {
			toast.success("Conta criada com sucesso.");
			console.log(response);
			setOpen(false);
			onSuccess?.();
		} catch (error) {
			toast.error("Erro ao criar conta.");
		}
	};
	const methods = useForm<BillsColumns>({
		resolver: zodResolver(billsSchema)
	});
	const changeMeetValue = (value: string) => {
		let number = +value.slice(2).replaceAll(".", "").replaceAll(",", ".");
		setValue(number);
		methods.setValue("_amount", +number);
		return value;
	};

	return (
		<>
			<Dialog open={isOpened} onOpenChange={setOpen}>
				<DialogTrigger asChild>{triggerButton}</DialogTrigger>
				<DialogContent className="lg:w-[40vw]">
					<DialogHeader>
						<DialogTitle className="font-normal text-primary-600">
							Criar conta
						</DialogTitle>
						<DialogDescription>
							Preencha as informações da conta.
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
							<div className="flex w-full flex-col gap-4">
								<div>
									<label
										htmlFor="name"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Nome da conta:
									</label>
									<Input
										className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
										type="text"
										placeholder="Título"
										error={
											methods.formState.errors._title
												?.message
										}
										{...methods.register("_title")}
									/>
								</div>
								<div>
									<label
										htmlFor="dueDate"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Data de vencimento:
									</label>
									<Input
										className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
										type="date"
										error={
											methods.formState.errors._dueDate
												?.message
										}
										{...methods.register("_dueDate")}
									/>
								</div>
							</div>
							<div className="flex w-full flex-col gap-4">
								<div>
									<label
										htmlFor="valor"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Valor:
									</label>
									<Input
										className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
										type="numeric"
										id="value"
										placeholder="Valor da conta"
										mask={"R$ 999.999.999,99"}
										error={
											methods.formState.errors._amount
												?.message
										}
										beforeMaskedStateChange={({
											nextState
										}) => {
											let number =
												nextState.value.replace(
													"R$ ",
													""
												);
											if (
												number.replaceAll(".", "")
													.length < 9
											) {
												number = number
													.trim()
													.split(".")
													.join();
												nextState.value =
													"R$ " + number;
												if (
													number.split(",").length > 2
												)
													nextState.value =
														"R$ " +
														number.replace(
															",",
															"."
														);
											}

											if (
												nextState.value.endsWith(",") ||
												nextState.value.endsWith(".")
											)
												nextState.value =
													nextState.value.slice(
														0,
														-1
													);
											return nextState;
										}}
										{...methods.register("_amount", {
											valueAsNumber: true,
											onChange: (e) =>
												changeMeetValue(e.target.value)
										})}
									/>
								</div>
								<div>
									<label
										htmlFor="billType"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Tipo:
									</label>
									<Controller
										name="_billType"
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
													<SelectValue placeholder="Selecione o tipo  " />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="A PAGAR">
														A pagar
													</SelectItem>
													<SelectItem value="A RECEBER">
														A receber
													</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
									{methods.formState.errors._billType && (
										<p className="text-sm text-red-400">
											{
												methods.formState.errors
													._billType?.message
											}
										</p>
									)}
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
