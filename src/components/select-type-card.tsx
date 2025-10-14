const SelectTypeCard = ({ register }: { register: any }) => {
  return (
    <div className="flex flex-col items-start justify-start">
      <label htmlFor="typeCard" className="w-full font-semibold">
        Type de carte
      </label>
      <select
        className="w-full h-full p-2 rounded-md border-2 border-gray-300"
        title="Type de carte"
        {...register("typeCard")}
      >
        <option value="basique">Basique</option>
        <option value="kanji">Kanji</option>
      </select>
    </div>
  );
};

export default SelectTypeCard;
