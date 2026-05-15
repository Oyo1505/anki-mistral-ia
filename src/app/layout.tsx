import ButtonsHeader from "@/components/buttons-header";
import Container from "@/components/container";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

const ToastContainer = dynamic(() =>
  import("react-toastify").then((mod) => mod.ToastContainer)
);

export const metadata: Metadata = {
  title: "Anki Mistral AI",
  description:
    "Générateur de cartes Anki pour l'apprentissage du japonais avec Mistral AI",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+JP:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="w-full min-h-screen p-2">
        <Container>
          <ToastContainer position="top-right" />
          <ButtonsHeader />
          {children}
        </Container>
      </body>
    </html>
  );
};
export default RootLayout;
