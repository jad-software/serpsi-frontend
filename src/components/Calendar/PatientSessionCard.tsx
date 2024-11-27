import {
	ClockIcon,
	DotsVerticalIcon,
	UserIcon
} from "@heroicons/react/outline";

export default function PatientSessionCard() {
	return (
		<div className="mb-2 flex h-16 w-full justify-between rounded-xl border border-primary-600 bg-white px-8">
			<div className="flex">
				<UserIcon width={28} />
				<div className="ml-2 flex flex-col items-start justify-center">
					<h2 className="sm:text-xl">Enzo Ferreira</h2>
					<span className="text-xs">Pag: Dinheiro</span>
				</div>
			</div>
			<div className="flex items-center justify-center">
				<ClockIcon width={24} />
				<span className="ml-1 text-lg">00:00</span>
			</div>
			<div className="mt-3">
				<DotsVerticalIcon width={16} />
			</div>
		</div>
	);
}
