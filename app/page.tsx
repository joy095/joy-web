import Hero from "@/components/Hero";
import ScrollToWorks from "@/components/ScrollToWorks";
import TransitionLink from "@/components/TransitionLink";

export default function Home() {
  return (
    <main>
      <div className="h-[200vh] flex items-center justify-center">
        <h1 className="text-5xl font-bold mb-10">Home Page</h1>

        <div className="space-x-6">
          <TransitionLink href="/about" className="text-blue-500 underline">
            Go to About
          </TransitionLink>

          <TransitionLink href="/contact" className="text-blue-500 underline">
            Go to Contact
          </TransitionLink>
        </div>

        {/* <ScrollToWorks /> */}

        <h1 className="text-5xl font-bold">Scroll Down to Go to Works →</h1>
      </div>
      
      <Hero />
    </main>
  );
}
