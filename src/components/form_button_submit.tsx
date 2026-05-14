const FormButtonSubmit = ({
  isPending,
  isSubmitDisabled,
}: {
  isPending: boolean;
  isSubmitDisabled: boolean;
}) => {
  const disabled = isPending || isSubmitDisabled;

  return (
    <button
      type="submit"
      className="ds-btn ds-btn--primary ds-btn--lg ds-btn--block"
      disabled={disabled}
      style={{ width: "100%" }}
    >
      {isPending ? (
        <>
          <span className="ds-spinner" aria-hidden="true" />
          Génération en cours…
        </>
      ) : isSubmitDisabled ? (
        "Saisissez du texte ou un fichier"
      ) : (
        <>
          <SparkleIcon />
          Générer
        </>
      )}
    </button>
  );
};

const SparkleIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
  </svg>
);

export default FormButtonSubmit;
