interface Props{
  name: string
}

const ComorbidityTag = ({name}: Props) => {
  return (
    <li className="flex items-center max-w-fit rounded-full text-center bg-primary-500 py-2 px-5">
      <span className="font-semibold text-slate-50">{name}</span>
    </li>
  )
}

export { ComorbidityTag };