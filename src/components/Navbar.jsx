import { Link, NavLink, useNavigate } from 'react-router-dom'
import { PawPrint, LogOut, Dog, HandHeart } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { initials } from '../lib/utils.js'

export default function Navbar() {
  const { currentUser, activeRole, setActiveRole, logout } = useApp()
  const navigate = useNavigate()

  function switchTo(role) {
    setActiveRole(role)
    navigate(role === 'owner' ? '/owner' : '/supporter')
  }

  const linkCls = ({ isActive }) =>
    `text-sm font-semibold transition-colors hover:text-brand-600 ${
      isActive ? 'text-brand-600' : 'text-slate-600'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-sand-50/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Adyen <span className="text-brand-600">Dog Connect</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={linkCls}>
            Home
          </NavLink>
          <NavLink to="/catalogue" className={linkCls}>
            Meet the dogs
          </NavLink>
          <a href="/#benefits" className="text-sm font-semibold text-slate-600 hover:text-brand-600">
            Why it helps
          </a>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="hidden items-center rounded-xl bg-white p-1 ring-1 ring-slate-200 sm:flex">
                <button
                  onClick={() => switchTo('owner')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                    activeRole === 'owner' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:text-brand-600'
                  }`}
                  title="Owner interface"
                >
                  <Dog className="h-4 w-4" /> Owner
                </button>
                <button
                  onClick={() => switchTo('supporter')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                    activeRole === 'supporter' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:text-brand-600'
                  }`}
                  title="Supporter interface"
                >
                  <HandHeart className="h-4 w-4" /> Supporter
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {initials(currentUser.name)}
                </span>
                <button
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
