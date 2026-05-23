import { Search } from "lucide-react";

const baseWrapperClass = "relative flex items-center";
const baseInputClass = "w-full bg-transparent outline-none";

const variants = {
  default: {
    wrapper: "",
    input: "",
    icon: "",
  },
  friend: {
    wrapper: "rounded-[16px] bg-white p-2 px-4 shadow-sm h-[60px] shrink-0",
    input: "pl-10 pr-2 text-[15px] font-medium",
    icon: "",
  },
};

export default function SearchInput({
  value,
  onChange,
  onFocus,
  onKeyDown,
  placeholder = "Tìm kiếm",
  autoFocus = false,
  variant = "default",
  wrapperClassName = "",
  inputClassName = "",
  iconClassName = "",
}) {
  const variantClass = variants[variant] || variants.default;

  return (
    <div className={`${baseWrapperClass} ${variantClass.wrapper} ${wrapperClassName}`}>
      <Search
        size={18}
        className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${variantClass.icon} ${iconClassName}`}
      />
      <input
        autoFocus={autoFocus}
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        readOnly={!onChange}
        placeholder={placeholder}
        className={`${baseInputClass} ${variantClass.input} ${inputClassName}`}
      />
    </div>
  );
}

