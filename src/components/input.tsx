import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type: string;
  label: string;
  title: string;
}

export default function Input({
  className,
  title,
  type,
  label,
  ...props
}: InputProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      <label className="ds-label" htmlFor={label}>
        {title}
      </label>
      <input
        id={label}
        type={type}
        {...props}
        className="ds-input"
      />
    </div>
  );
}
