import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { InputText } from "@/components/form/InputText";
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
import { updateOneBill } from "@/services/billsService";
import { formatDateToddmmYYYY } from "@/services/utils/formatDate";
import { PencilAltIcon } from "@heroicons/react/outline";
import { Checkbox } from "@/components/ui/checkbox";

type updateOneBillDialogProps = {
	triggerButton: ReactNode;
	bill: BillsColumns;
};

export function UpdateOneBillDialog({
	triggerButton,
	bill
}: updateOneBillDialogProps) {
	const [isUpdating, setUpdating] = useState(false);
	const [value, setValue] = useState(0);
	const [dueDate, setDueDate] = useState(new Date());
	const [paymentDate, setPaymentDate] = useState(new Date());
	const [hasPaymentDate, setHasPaymentDate] = useState(false);

	const [isOpened, setOpen] = useState(false);
	const billsSchema = z.object({
		name: z.string().min(1, "Título é um campo obrigatório."),
		value: z.number().positive("O valor deve ser maior que 0"),
		billType: z
			.string()
			.min(5, "Tipo é um campo obrigatório.")
			.transform((val) => val.toUpperCase()),
		dueDate: z
			.preprocess((val) => {
				return val === "" ? undefined : val;
			}, z.coerce.date().optional())
			.refine((val) => val !== undefined, {
				message: "Data de vencimento é obrigatória."
			}),
		paymentDate: z.preprocess((val) => {
			return val === "" ? undefined : val;
		}, z.coerce.date().optional())
	});

	const onSubmit = async (data: BillsColumns) => {
		if (!hasPaymentDate) {
			data.paymentDate = undefined;
		}
		const response = await updateOneBill(data);
		// if (response?.error) {
		// 	toast.error("Algo de errado aconteceu.");
		// } else {
		toast.success("Conta atualizada com sucesso.");
		console.log(response);
		setOpen(false);
		// }
	};
	const methods = useForm<BillsColumns>({
		resolver: zodResolver(billsSchema)
	});
	useEffect(() => {
		methods.reset({ ...bill });
		setValue(bill.value);
		setDueDate(bill.dueDate as Date);
		setHasPaymentDate(false);
		if (bill.paymentDate) {
			console.log("tem paymentDate");
			setHasPaymentDate(true);
			setPaymentDate(bill.paymentDate as Date);
		}
		methods.setValue("billType", bill.billType);
	}, [bill, methods]);

	const changeMeetValue = (value: string) => {
		let number = +value.slice(2).replaceAll(".", "").replaceAll(",", ".");
		setValue(number);
		methods.setValue("value", +number);
		return value;
	};
	const setOpens = (value: boolean) => {
		setOpen(value);
		setUpdating(false);
	};
	return (
		<>
			<Dialog open={isOpened} onOpenChange={setOpens}>
				<DialogTrigger asChild>{triggerButton}</DialogTrigger>
				<DialogContent className="lg:w-[40vw]">
					<DialogHeader>
						<DialogTitle className="font-normal text-primary-600">
							Conta{" "}
							{!isUpdating ? (
								<Button
									variant={"link"}
									onClick={() => setUpdating(!isUpdating)}
								>
									<PencilAltIcon
										width={24}
										height={24}
										className="text-primary-600"
									/>
								</Button>
							) : null}
						</DialogTitle>
						<DialogDescription>
							{isUpdating ? (
								<p>Atualize as informações da conta.</p>
							) : null}
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
									{isUpdating ? (
										<Input
											className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
											type="text"
											placeholder="Título"
											error={
												methods.formState.errors.name
													?.message
											}
											{...methods.register("name")}
										/>
									) : (
										<p className="mb-1 w-full text-sm font-normal text-primary-950">
											{methods.getValues("name")}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="dueDate"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Data de vencimento:
									</label>
									{isUpdating ? (
										<Input
											className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
											type="date"
											error={
												methods.formState.errors.dueDate
													?.message
											}
											value={
												dueDate
													.toISOString()
													.split("T")[0]
											}
											{...methods.register("dueDate", {
												setValueAs: (val) => {
													setDueDate(new Date(val));
													return val;
												},
												onChange: (e) =>
													setDueDate(
														new Date(e.target.value)
													)
											})}
										/>
									) : (
										<p className="mb-1 w-full text-sm font-normal text-primary-950">
											{formatDateToddmmYYYY(dueDate)}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="paymentDate"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Data de Pagamento:
									</label>
									{isUpdating ? (
										<>
											<Checkbox
												checked={hasPaymentDate}
												onCheckedChange={() => {
													if (!hasPaymentDate) {
														methods.unregister(
															"paymentDate"
														);
													}
													setHasPaymentDate(
														!hasPaymentDate
													);
												}}
												className="h-4 w-4"
											/>
											{hasPaymentDate ? (
												<Input
													className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
													type="date"
													error={
														methods.formState.errors
															.paymentDate
															?.message
													}
													value={
														(paymentDate as Date)
															.toISOString()
															.split("T")[0]
													}
													{...methods.register(
														"paymentDate",
														{
															setValueAs: (
																val
															) => {
																setPaymentDate(
																	new Date(
																		val
																	)
																);
																return val;
															},
															onChange: (e) =>
																setPaymentDate(
																	new Date(
																		e.target.value
																	)
																)
														}
													)}
												/>
											) : (
												<Input
													className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
													type="date"
													disabled
												/>
											)}
										</>
									) : (
										<p className="mb-1 w-full text-sm font-normal text-primary-950">
											{hasPaymentDate
												? formatDateToddmmYYYY(
														paymentDate as Date
													)
												: "-"}
										</p>
									)}
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
									{isUpdating ? (
										<Input
											className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
											type="numeric"
											id="value"
											value={"" + value}
											error={
												methods.formState.errors.value
													?.message
											}
											placeholder="Valor da conta"
											mask={"R$ 999.999.999,99"}
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
														number.split(",")
															.length > 2
													)
														nextState.value =
															"R$ " +
															number.replace(
																",",
																"."
															);
												}

												if (
													nextState.value.endsWith(
														","
													) ||
													nextState.value.endsWith(
														"."
													)
												)
													nextState.value =
														nextState.value.slice(
															0,
															-1
														);
												return nextState;
											}}
											{...methods.register("value", {
												valueAsNumber: true,
												onChange: (e) =>
													changeMeetValue(
														e.target.value
													)
											})}
										/>
									) : (
										<p className="mb-1 w-full text-sm font-normal text-primary-950">
											R$ {value.toFixed(2)}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="billType"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Tipo:
									</label>
									{isUpdating ? (
										<>
											<Controller
												name="billType"
												control={methods.control}
												render={({ field }) => (
													<Select
														onValueChange={
															field.onChange
														}
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
											{methods.formState.errors
												.billType && (
												<p className="text-sm text-red-400">
													{
														methods.formState.errors
															.billType?.message
													}
												</p>
											)}
										</>
									) : (
										<p className="mb-1 w-full text-sm font-normal text-primary-950">
											{methods.getValues("billType")}
										</p>
									)}
								</div>
							</div>
						</div>
						<div className="flex w-full justify-between gap-4">
							{isUpdating ? (
								<>
									<Button
										className="rounded px-4 py-2 text-red-600 hover:bg-red-600/70"
										onClick={() => setUpdating(false)}
										variant={"outline"}
									>
										Cancelar
									</Button>
									<Button
										className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600/70"
										type="submit"
									>
										Confirmar
									</Button>
								</>
							) : null}
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
