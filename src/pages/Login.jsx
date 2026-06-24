import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { PawPrint } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const DEMO = [
  { email: 'sanne@adyen.com', role: 'Owner' },
  { email: 'maya@adyen.com', role: 'Supporter' },
]

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    setError('')
    const res = login(form)
    if (res.error) return setError(res.error)
    const dest =
      location.state?.from || (res.user.role === 'owner' ? '/owner' : '/supporter')
    navigate(dest)
  }

  function fillDemo(email) {
    setForm({ email, password: 'demo' })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white">
          <PawPrint className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-slate-600">Log in to your Adyen Dog Connect account.</p>
      </div>

      <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@adyen.com"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Your password"
          />
        </div>
        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Log in
        </button>
        <p className="text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
      </form>

      <div className="mt-6 rounded-2xl bg-sand-100 p-4 text-sm">
        <p className="font-semibold text-slate-700">Try the demo accounts (password: demo)</p>
        <div className="mt-2 flex flex-col gap-2">
          {DEMO.map((d) => (
            <button
              key={d.email}
              onClick={() => fillDemo(d.email)}
              className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-left ring-1 ring-slate-100 hover:ring-brand-300"
            >
              <span className="font-medium text-slate-700">{d.email}</span>
              <span className="badge bg-brand-100 text-brand-700">{d.role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
