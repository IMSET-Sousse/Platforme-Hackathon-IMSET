import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#222222] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">À propos</h3>
            <p className="text-[#b9b9b9]">
              Le Hackathon IMSET est un événement annuel qui rassemble les étudiants et professionnels pour relever des
              défis techniques innovants.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-[#b9b9b9]">
              <li>Email: contact@hackathon-imset.com</li>
              <li>Téléphone: +216 XX XXX XXX</li>
              <li>Adresse: Campus IMSET, Tunis</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-[#b9b9b9] hover:text-[#d7b369] transition-colors">
                  Règlement
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#b9b9b9] hover:text-[#d7b369] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#b9b9b9] hover:text-[#d7b369] transition-colors">
                  Éditions précédentes
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-[#b9b9b9]">
          <p>&copy; {currentYear} Hackathon IMSET. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
