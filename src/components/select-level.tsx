"use client";

import clsx from "clsx";
import { UseFormRegister } from "react-hook-form";

interface SelectLevelProps {
  className?: string;
  levels: { value: string; label: string }[];
  register: UseFormRegister<any>;
  defaultValue?: string;
}

export default function SelectLevel({
  className,
  levels,
  register,
  defaultValue,
}: SelectLevelProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      <label className="ds-label" htmlFor="level">
        Niveau
        <span style={{ color: "var(--hinomaru-500)" }}> *</span>
      </label>
      <select
        id="level"
        className="ds-select"
        style={{
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a1d24' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 36,
        }}
        defaultValue={defaultValue}
        {...register("level")}
      >
        {levels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>
    </div>
  );
}
