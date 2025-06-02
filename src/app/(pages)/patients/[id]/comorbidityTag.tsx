interface Props {
	name: string;
}

const ComorbidityTag = ({ name }: Props) => {
	return (
		<li className="flex max-w-fit items-center rounded-full bg-primary-500 px-5 py-2 text-center">
			<span className="font-semibold text-slate-50">{name}</span>
		</li>
	);
};

export { ComorbidityTag };
