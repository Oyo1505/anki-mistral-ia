import ButtonsHeader from '@/components/buttons-header';
import Container from '@/components/container';
import { ToastContainer } from 'react-toastify';
import './globals.css';

export const metadata = {
  title: 'Anki Mistral AI',
  description: 'Générateur de cartes Anki pour l\'apprentissage du japonais avec Mistral AI',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <html>
    <body className="w-full h-screen p-2"
    >
    <Container>
      <ToastContainer position="top-right" />
      <ButtonsHeader />
        {children}
    </Container>
    </body>
  </html>
}
export default RootLayout;