import { FormDataSchemaType } from "@/schema/form-schema";
import { UseFormRegister } from "react-hook-form";

interface SelectTypeCardProps {
  register: UseFormRegister<FormDataSchemaType>;
}

const SelectTypeCard = ({
  register,
}: {
  register: SelectTypeCardProps["register"];
}) => {
  return (
    <div className="flex flex-col items-start justify-start">
      <label htmlFor="typeCard" className="w-full font-semibold">
        Type de carte
      </label>
      <select
        id="typeCard"
        className="w-full h-full p-2 rounded-md border-2 border-gray-300"
        {...register("typeCard")}
      >
        <option value="basique">Basique</option>
        <option value="kanji">Kanji</option>
      </select>
    </div>
  );
};

export default SelectTypeCard;
