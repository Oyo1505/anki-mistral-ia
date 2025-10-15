import { Dispatch, SetStateAction } from "react";

const ButtonDisplayCard = ({
  csvDataSuccess,
  setIsCsvVisible,
  isCsvVisible,
}: {
  csvDataSuccess: boolean;
  setIsCsvVisible: Dispatch<SetStateAction<boolean>>;
  isCsvVisible: boolean;
}) => {
  return (
    <>
      {csvDataSuccess && (
        <>
          <button
            className="w-full p-2 rounded-md border-2 border-gray-300 text-center cursor-pointer font-bold"
            onClick={() => setIsCsvVisible(() => !isCsvVisible)}
          >
            {isCsvVisible ? "Masquer les cartes" : "Voir les cartes"}
          </button>
        </>
      )}
    </>
  );
};

export default ButtonDisplayCard;
