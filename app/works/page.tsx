import TransitionLink from "@/components/TransitionLink";

export default function Works() {
  return (
    <main className="h-screen flex items-center justify-center bg-purple-500 text-white">
      <h1 className="text-5xl font-bold">Works Page</h1>

      <TransitionLink href="/" className="text-blue-500 underline">
        Back Home
      </TransitionLink>
    </main>
  );
}
