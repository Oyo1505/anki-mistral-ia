const FormButtonSubmit = ({
  isPending,
  isSubmitDisabled,
}: {
  isPending: boolean;
  isSubmitDisabled: boolean;
}) => {
  return (
    <button
      type="submit"
      className={`w-full p-2 rounded-md text-white font-bold ${
        isPending
          ? "bg-gray-400 cursor-not-allowed"
          : isSubmitDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-700 cursor-pointer"
      }`}
      disabled={isPending || isSubmitDisabled}
    >
      {isPending
        ? "Génération en cours..."
        : isSubmitDisabled
        ? "Veuillez entrer du texte ou ajouter une image"
        : "Générer"}
    </button>
  );
};

export default FormButtonSubmit;
