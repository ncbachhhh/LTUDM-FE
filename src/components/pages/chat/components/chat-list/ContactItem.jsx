export default function ContactItem({
  id,
  name,
  message,
  onSelect,
  time,
  isActive,
  isGroup,
  avatar,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="flex w-full items-center gap-3 rounded-xl p-1 text-left transition-colors hover:bg-gray-50"
    >
      <div
        className={`h-11 w-11 shrink-0 overflow-hidden rounded-full ${
          isGroup ? "bg-black p-2" : "bg-gray-100"
        }`}
      >
        <img src={avatar} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-[13px] font-bold">{name}</h4>
        <p className="truncate text-[11px] text-gray-400">{message}</p>
        <span className="text-[10px] text-gray-300">{time}</span>
      </div>

      {isActive && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
    </button>
  );
}
