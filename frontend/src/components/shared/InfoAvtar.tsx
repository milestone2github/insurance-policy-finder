interface InfoRowProps{
  avatarUrl: string;
  name: string;
}
export default function InfoRow({ avatarUrl, name }: InfoRowProps) {
  return (
    <div className="flex items-center space-x-3 m-3">
      <img
        src={avatarUrl}
        alt={name}
        className="w-10 h-10 rounded-full bg-gray-200"
      />
      <span className="font-bold text-gray-800">
        {name}
      </span>
    </div>
  )
}
