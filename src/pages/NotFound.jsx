import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <PawPrint className="mx-auto h-14 w-14 text-brand-200" />
      <h1 className="mt-4 text-4xl font-extrabold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">This page wandered off chasing a squirrel.</p>
      <Link to="/" className="btn-primary mt-6">
        Back home
      </Link>
    </div>
  )
}
