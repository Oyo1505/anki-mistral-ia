import { FormDataSchemaType } from "@/schema/form-schema";
import { UseFormRegister } from "react-hook-form";

interface SelectTypeCardProps {
  register: UseFormRegister<FormDataSchemaType>;
}

const SelectTypeCard = ({ register }: SelectTypeCardProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor="typeCard" className="ds-label">
        Type de carte
      </label>
      <select
        id="typeCard"
        className="ds-select"
        style={{
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a1d24' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 36,
        }}
        {...register("typeCard")}
      >
        <option value="basique">Basique</option>
        <option value="kanji">Kanji</option>
      </select>
    </div>
  );
};

export default SelectTypeCard;
