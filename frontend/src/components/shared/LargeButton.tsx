
import { Check } from 'lucide-react'

type LargeButtonProps = {
  label: string
  selected: boolean
  onClick: () => void
}

export default function LargeButton({ label, selected, onClick }: LargeButtonProps) {
  return (
    <div
      role="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        relative
        bg-white
        rounded-lg
        shadow-sm
        hover:shadow-md
        cursor-pointer
        p-6
        flex items-center justify-center
        transition
        ${selected
          ? 'border-2 border-green-500'
          : 'border border-gray-200'}
      `}
    >
      {/* checkmark badge */}
      {selected && (
        <div className="absolute top-2 left-2 bg-green-100 rounded-full p-1">
          <Check className="w-4 h-4 text-green-600" />
        </div>
      )}

      {/* label */}
      <span className={`font-medium ${selected ? 'text-gray-900' : 'text-gray-700'}`}>
        {label}
      </span>
    </div>
  )
}
