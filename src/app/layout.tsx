import ButtonsHeader from "@/components/buttons-header";
import Container from "@/components/container";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

// Defer ToastContainer loading - non-critical for initial render (bundle-defer-third-party)
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
      <body className="w-full h-screen p-2">
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
