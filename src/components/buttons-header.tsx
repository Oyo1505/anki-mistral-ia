"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ButtonsHeader = () => {
  const pathname = usePathname();
  const isCards = pathname === "/";
  const isChat = pathname === "/chat";

  const navBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 14px",
    borderRadius: "var(--r-md)",
    fontSize: "var(--fs-sm)",
    fontWeight: "var(--fw-semibold)",
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    background: active ? "var(--sumi-900)" : "transparent",
    color: active ? "var(--washi-50)" : "var(--fg-2)",
    border: "1px solid",
    borderColor: active ? "var(--sumi-900)" : "transparent",
    transition: "background 150ms, color 150ms",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
  });

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 4px",
        marginBottom: 16,
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
          color: "var(--fg-1)",
        }}
        aria-label="Anki Mistral — accueil"
      >
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--r-md)",
            background: "var(--sumi-900)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--washi-50)",
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            fontSize: 22,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          暗
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--fg-1)",
            }}
          >
            Anki Mistral
          </span>
          <span
            style={{
              fontSize: 11,
              color: "var(--fg-3)",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Japanese flashcards · AI
          </span>
        </div>
      </Link>

      <nav
        aria-label="Navigation principale"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: 4,
          background: "var(--washi-100)",
          borderRadius: 12,
          border: "1px solid var(--border-1)",
        }}
      >
        <Link
          href="/"
          aria-current={isCards ? "page" : undefined}
          style={navBtnStyle(isCards)}
        >
          <CardsIcon />
          Cartes
        </Link>
        <Link
          href="/chat"
          data-testid="button-chat"
          aria-current={isChat ? "page" : undefined}
          style={navBtnStyle(isChat)}
        >
          <ChatIcon />
          Chat Bot
        </Link>
      </nav>
    </header>
  );
};

const CardsIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <rect x="3" y="6" width="14" height="14" rx="2"/>
    <path d="M7 3h14v14"/>
  </svg>
);

const ChatIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export default ButtonsHeader;
