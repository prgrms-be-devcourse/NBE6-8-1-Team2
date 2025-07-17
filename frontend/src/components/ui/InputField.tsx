"use client";

export const InputField = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  className = "",
}: {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className={`w-full border border-gray-400 rounded-md px-4 py-3 text-sm ${className}`}
    />
  );
};
