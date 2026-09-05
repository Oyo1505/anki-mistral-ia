"use client";

interface CheckboxProps {
  label: string;
  title: string;
  handleChangeCheckboxAction: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({
  label,
  title,
  handleChangeCheckboxAction,
}: CheckboxProps) {
  return (
    <label
      htmlFor={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "12px 14px",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--r-md)",
        background: "#fff",
        cursor: "pointer",
        userSelect: "none",
        fontSize: "var(--fs-sm)",
        color: "var(--fg-1)",
        transition: "background 120ms, border-color 120ms",
      }}
    >
      <span>{title}</span>
      <input
        id={label}
        type="checkbox"
        onChange={handleChangeCheckboxAction}
        style={{ width: 18, height: 18, accentColor: "var(--sumi-900)", cursor: "pointer" }}
      />
    </label>
  );
}
