import Image from "next/image"
import GithubSignInButton from "@/components/GithubSignInButton"
import CountdownTimer from "@/components/countdown-timer"
import Footer from "@/components/footer"

export default function Home() {
  // Date du hackathon (à ajuster selon vos besoins)
  const hackathonDate = new Date("2025-05-15T09:00:00")

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* En-tête avec logos */}
        <header className="container mx-auto py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/placeholder.svg?height=60&width=120"
              alt="Logo IMSET"
              width={120}
              height={60}
              className="h-12 w-auto"
            />
            <div className="h-8 w-px bg-gray-300 hidden sm:block" />
            <Image
              src="/placeholder.svg?height=60&width=120"
              alt="Logo Hackathon"
              width={120}
              height={60}
              className="h-12 w-auto"
            />
          </div>
        </header>

        {/* Section principale */}
        <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#222222]">Hackathon IMSET 2025</h1>

          <p className="text-lg md:text-xl max-w-3xl mb-8 text-[#8b8b8bde]">
            Rejoignez le plus grand événement de programmation de l'année. Formez votre équipe, relevez des défis
            passionnants et démontrez vos compétences techniques dans une compétition stimulante.
          </p>

          <GithubSignInButton /> {/* Replaced Button with new component */}

          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4 text-[#222222]">Le hackathon commence dans</h2>
            <CountdownTimer targetDate={hackathonDate} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}