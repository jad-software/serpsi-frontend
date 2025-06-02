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
import { updateOneBill, deleteBill } from "@/services/billsService";
import { formatDateToddmmYYYY } from "@/services/utils/formatDate";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

type updateOneBillDialogProps = {
	triggerButton: ReactNode;
	bill: BillsColumns;
	onSuccess: () => void;
};

export function UpdateOneBillDialog({
	triggerButton,
	bill,
	onSuccess
}: updateOneBillDialogProps) {
	const [isUpdating, setUpdating] = useState(false);
	const [value, setValue] = useState(0);
	const [dueDate, setDueDate] = useState(new Date());
	const [paymentDate, setPaymentDate] = useState(new Date());
	const [hasPaymentDate, setHasPaymentDate] = useState(false);

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
		try {
			const response = await updateOneBill({ ...bill, ...data });
			toast.success("Conta atualizada com sucesso.");
			setOpen(false);
			onSuccess?.();
		} catch (error) {
			toast.error("Erro ao atualizar conta.");
		}
	};
	const onDelete = async (data: BillsColumns) => {
		try {
			await deleteBill(data);
			toast.success("Conta deletada com sucesso.");
			onSuccess?.();
			setOpen(false);
		} catch (error) {
			toast.error("Erro ao deletar conta.");
		}
	};

	const methods = useForm<BillsColumns>({
		resolver: zodResolver(billsSchema)
	});
	useEffect(() => {
		methods.reset({ ...bill });
		setValue(bill._amount);
		setDueDate(bill._dueDate as Date);
		if (bill._paymentMethod) {
			setHasPaymentDate(true);
			setPaymentDate(bill._paymentMethod._paymentDate as Date);
		}
		methods.setValue("_billType", bill._billType);
	}, [bill, methods]);

	const changeMeetValue = (value: string) => {
		let number = +value.slice(2).replaceAll(".", "").replaceAll(",", ".");
		setValue(number);
		methods.setValue("_amount", +number);
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
				<DialogContent className="lg:w-[40dvw]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3 font-normal text-primary-600">
							Conta{" "}
							{!isUpdating ? (
								<>
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
									<Button
										variant={"link"}
										onClick={async () => {
											await onDelete(bill);
										}}
									>
										<TrashIcon
											width={24}
											height={24}
											className="text-red-600"
										/>
									</Button>
								</>
							) : null}
						</DialogTitle>
						<DialogDescription>
							{isUpdating
								? "Atualize as informações da conta."
								: null}
						</DialogDescription>
					</DialogHeader>
					<form
						className="mt-1 flex flex-col justify-end gap-6"
						onSubmit={methods.handleSubmit(onSubmit, (data) => {
							toast.warning("Algo deu errado");
						})}
					>
						<div className="flex w-full flex-col gap-6 md:flex-row">
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
												methods.formState.errors._title
													?.message
											}
											{...methods.register("_title")}
										/>
									) : (
										<p className="mb-1 w-full text-sm font-normal text-primary-950">
											{methods.getValues("_title")}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="_dueDate"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Data de vencimento:
									</label>
									{isUpdating ? (
										<Input
											className="border-primary-600 outline-primary-600 focus-visible:ring-primary-600"
											type="date"
											error={
												methods.formState.errors
													._dueDate?.message
											}
											value={
												new Date(dueDate)
													.toISOString()
													.split("T")[0]
											}
											{...methods.register("_dueDate", {
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
										Data de Pagamento:{" "}
									</label>
									{isUpdating ? (
										<></>
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
												methods.formState.errors._amount
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
											{...methods.register("_amount", {
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
												name="_billType"
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
												._billType && (
												<p className="text-sm text-red-400">
													{
														methods.formState.errors
															._billType?.message
													}
												</p>
											)}
										</>
									) : (
										<p className="mb-1 w-full text-sm font-normal text-primary-950">
											{methods.getValues("_billType")}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="paymentType"
										className="mb-1 w-full text-sm font-normal text-primary-950"
									>
										Forma de pagamento:
									</label>
									{isUpdating ? (
										<></>
									) : (
										<p className="mb-1 w-full text-sm font-normal text-primary-950">
											{hasPaymentDate
												? methods.getValues(
														"_paymentMethod._paymentType"
													)
												: "-"}
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
