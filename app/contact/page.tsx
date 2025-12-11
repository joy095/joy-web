import TransitionLink from "@/components/TransitionLink";

export default function Contact() {
  return (
    <main className="p-20 text-center">
      <h1 className="text-5xl font-bold mb-10">Contact Page</h1>

      <TransitionLink href="/" className="text-blue-500 underline">
        Back Home
      </TransitionLink>
    </main>
  );
}
