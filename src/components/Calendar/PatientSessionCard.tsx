import { formatHour } from "@/services/utils/formatDate";
import {
	CheckCircleIcon,
	CheckIcon,
	ClockIcon,
	DotsVerticalIcon,
	PencilAltIcon,
	UserIcon,
	XCircleIcon,
	XIcon
} from "@heroicons/react/outline";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { updateMeetingStatus } from "@/services/meetingsService";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PatientSessionCardProps {
	id: string;
	name: string;
	// paymentPlan: string;
	status: "CANCELADO" | "CONFIRMADO" | string;
	schedule: string;
}

export default function PatientSessionCard({
	id,
	name,
	// paymentPlan,
	status,
	schedule
}: PatientSessionCardProps) {
	const [sessionStatus, setSessionStatus] = useState(status);

	const getStatusIcon = () => {
		if (sessionStatus === "CONFIRMADO") {
			return <CheckCircleIcon width={24} color="#2E7D32" />;
		} else if (sessionStatus === "CANCELADO") {
			return <XCircleIcon width={24} color="#E64A19" />;
		}

		return <ClockIcon width={24} />;
	};

	const confirmSession = () => {
		try {
			toast.promise(updateMeetingStatus(id, "CONFIRMADO"), {
				loading: "Confirmando sessão...",
				success: "Sessão confirmada com sucesso!",
				error: "Houve um erro ao confirmar sessão."
			});
			setSessionStatus("CONFIRMADO");
		} catch (error) { }
	};

	const cancelSession = () => {
		try {
			toast.promise(updateMeetingStatus(id, "CANCELADO"), {
				loading: "Cancelando sessão...",
				success: "Sessão cancelada com sucesso!",
				error: "Houve um erro ao cancelar sessão."
			});
			setSessionStatus("CANCELADO");
		} catch (error) { }
	};

	const router = useRouter();

	return (
		<div
			className="mb-2 flex h-16 w-full justify-between rounded-xl border border-primary-600 bg-white px-8 
					hover:bg-primary-50 cursor-pointer"
			onClick={() => router.push(`/sessions/${id}`)}
		>
			<div className="flex">
				<UserIcon width={28} />
				<div className="ml-2 flex flex-col items-start justify-center">
					<h2 className="sm:text-xl">{name}</h2>
					{/* <span className="text-xs">Pag: {}</span> */}
				</div>
			</div>
			<div className="flex items-center justify-center">
				{getStatusIcon()}
				<span className="ml-1 text-lg">{formatHour(schedule)}</span>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger className="rounded-full px-2">
					<DotsVerticalIcon width={20} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						className="cursor-pointer"
						{...{ disabled: sessionStatus === "CANCELADO" }}
					>
						<PencilAltIcon width={16} height={16} />
						&nbsp; Editar Sessão
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={confirmSession}
						{...{ disabled: sessionStatus === "CANCELADO" }}
					>
						<CheckIcon width={16} height={16} />
						&nbsp; Confirmar
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={cancelSession}
						{...{ disabled: sessionStatus === "CANCELADO" }}
					>
						<XIcon width={16} height={16} />
						&nbsp; Cancelar
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
