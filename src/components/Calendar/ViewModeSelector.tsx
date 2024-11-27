interface ViewModeProps {
	viewMode: string;
	setViewMode: (viewMode: "day" | "week") => void;
}

export default function ViewModeSelector({
	viewMode,
	setViewMode
}: ViewModeProps) {
	const handleViewModeChange = (mode: "day" | "week") => {
		setViewMode(mode);
	};

	const selectedMode = (mode: string) => {
		if (mode === viewMode) {
			return " animate-fadeIn bg-primary-100 text-zinc-900";
		} else {
			return " bg-white text-zinc-900";
		}
	};

	return (
		<div className="hidden md:flex">
			<button
				className={
					"w-24 rounded-l-lg border py-1 text-sm" +
					selectedMode("day")
				}
				onClick={() => handleViewModeChange("day")}
			>
				Dia
			</button>
			<button
				className={
					"w-24 rounded-r-lg border py-1 text-sm" +
					selectedMode("week")
				}
				onClick={() => handleViewModeChange("week")}
			>
				Semana
			</button>
		</div>
	);
}
