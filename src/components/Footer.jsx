import { PawPrint } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <PawPrint className="h-4 w-4 text-brand-600" />
          Adyen Dog Connect
        </div>
        <p>An internal wellbeing initiative for Adyen Amsterdam. Made with care.</p>
        <p>&copy; {new Date().getFullYear()} Adyen Dog Connect</p>
      </div>
    </footer>
  )
}
