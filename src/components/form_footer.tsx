const FooterForm = () => {
  return (
    <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
      <a
        className="ds-btn ds-btn--ghost"
        href="https://relieved-circle-d57.notion.site/Tuto-cr-ation-carte-basique-Anki-avec-ChatGPT-19a6823eb75b80e7b564dbc8cf73762d"
        target="_blank"
        rel="noopener noreferrer"
        style={{ flex: 1, fontSize: "var(--fs-xs)" }}
      >
        <ExternalIcon />
        Tutoriel d&apos;importation
      </a>
      <a
        className="ds-btn ds-btn--ghost"
        href="https://apps.ankiweb.net/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ flex: 1, fontSize: "var(--fs-xs)" }}
      >
        <ExternalIcon />
        Télécharger Anki
      </a>
    </div>
  );
};

const ExternalIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export default FooterForm;
