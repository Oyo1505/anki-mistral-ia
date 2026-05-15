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
  if (!csvDataSuccess) return null;

  return (
    <button
      className="ds-btn ds-btn--secondary ds-btn--block"
      style={{ width: "100%" }}
      onClick={() => setIsCsvVisible((v) => !v)}
    >
      <CardsIcon />
      {isCsvVisible ? "Masquer les cartes" : "Voir les cartes"}
    </button>
  );
};

const CardsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <rect x="3" y="6" width="14" height="14" rx="2"/>
    <path d="M7 3h14v14"/>
  </svg>
);

export default ButtonDisplayCard;
