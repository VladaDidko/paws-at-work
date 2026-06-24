import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Dog, HandHeart, PawPrint, Check } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialRole = params.get('role') === 'owner' ? 'owner' : params.get('role') === 'supporter' ? 'supporter' : ''

  const [role, setRole] = useState(initialRole)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function submit(e) {
    e.preventDefault()
    setError('')
    if (!role) return setError('Please choose how you’d like to join.')
    if (!form.name || !form.email || !form.password)
      return setError('Please fill in all fields.')
    const res = signup({ ...form, role })
    if (res.error) return setError(res.error)
    navigate(role === 'owner' ? '/owner' : '/supporter')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <span className="badge bg-brand-100 text-brand-700">
          <PawPrint className="h-3.5 w-3.5" /> Join Adyen Dog Connect
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-slate-600">
          First, tell us how you’d like to start — you can switch between both interfaces anytime.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <RoleCard
          active={role === 'owner'}
          onClick={() => setRole('owner')}
          icon={Dog}
          title="Dog Owner"
          text="Share your dog with the team and manage who visits and when."
        />
        <RoleCard
          active={role === 'supporter'}
          onClick={() => setRole('supporter')}
          icon={HandHeart}
          title="Dog Supporter"
          text="Book walks, play breaks and cuddle time with colleagues’ dogs."
        />
      </div>

      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label">Full name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="label">Adyen email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@adyen.com"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="Choose a password"
          />
        </div>

        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

        <button type="submit" className="btn-primary w-full">
          Create account
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

function RoleCard({ active, onClick, icon: Icon, title, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border-2 p-5 text-left transition ${
        active ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300'
      }`}
    >
      {active && (
        <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      <span
        className={`grid h-12 w-12 place-items-center rounded-xl ${
          active ? 'bg-brand-600 text-white' : 'bg-sand-100 text-brand-600'
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </button>
  )
}
