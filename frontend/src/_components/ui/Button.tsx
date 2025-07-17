export const Button = ({
    type,
    disabled,
    children,
    onClick,
  }: {
    type: "button" | "submit";
    disabled: boolean;
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className="mt-4 px-4 py-2 bg-gray-500 text-white"
        disabled={disabled}
      >
        {children}
      </button>
    );
  };