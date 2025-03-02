import Form from "@/components/form";

export default function Home() {
  return (
    <main className="my-auto mx-auto w-full md:w-1/3 border-2 border-white box-shadow-lg rounded-md p-4 flex flex-col items-center justify-center bg-white gap-4">
      <h1 className="text-xl font-bold">Générateur de cartes Anki (Japonais)</h1>
      <Form />
    </main>
  );
}