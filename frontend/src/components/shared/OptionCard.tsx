
type OptionCardProps = {
  label: string
  selected: boolean
  onClick: () => void
}
export default function OptionCard({ label, selected, onClick }:OptionCardProps) {
  return (
<div
  onClick={onClick}
  className={`
    relative flex justify-center items-center
    w-full            
    max-w-[200px]
    mx-auto
    px-4 py-2 rounded-md cursor-pointer m-2
    space-x-10
    ${
      selected
        ? "border-2 border-green-500 bg-green-50 text-green-700"
        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
    }
  `}
>
  {label}
</div>


  )
}

