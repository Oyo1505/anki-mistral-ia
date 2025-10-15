import dynamic from "next/dynamic";
const Form = dynamic(() => import("@/components/form"), {
  loading: () => <div>Préparation du formulaire...</div>,
});

export default function Home() {
  return (
    <main className="w-full">
      <Form />
    </main>
  );
}
