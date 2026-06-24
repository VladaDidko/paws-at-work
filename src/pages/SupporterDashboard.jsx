import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarHeart,
  Search,
  Check,
  X,
  CalendarClock,
  Hourglass,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { formatDate, STATUS_META } from '../lib/utils.js'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'proposed', label: 'Needs response' },
  { key: 'approved', label: 'Approved' },
  { key: 'past', label: 'Past & closed' },
]

export default function SupporterDashboard() {
  const { currentUser, bookings, dogById, userById, acceptProposal, cancelBooking } = useApp()
  const [filter, setFilter] = useState('all')

  const myBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.supporterId === currentUser.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [bookings, currentUser],
  )

  const filtered = myBookings.filter((b) => {
    if (filter === 'all') return true
    if (filter === 'past') return ['declined', 'cancelled'].includes(b.status)
    return b.status === filter
  })

  const upcoming = myBookings.filter((b) => b.status === 'approved').length
  const waiting = myBookings.filter((b) => ['pending', 'proposed'].includes(b.status)).length

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-600">Supporter dashboard</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Hi {currentUser.name.split(' ')[0]} 🐾
          </h1>
          <p className="mt-1 text-slate-600">Track your dog-time bookings and find new friends.</p>
        </div>
        <Link to="/catalogue" className="btn-primary">
          <Search className="h-4 w-4" /> Find a dog
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <CalendarClock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{upcoming}</p>
            <p className="text-sm text-slate-500">Approved visits</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <Hourglass className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{waiting}</p>
            <p className="text-sm text-slate-500">Awaiting response</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f.key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <CalendarHeart className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No bookings here yet.</p>
            <Link to="/catalogue" className="btn-soft mt-4">
              Browse the dogs
            </Link>
          </div>
        ) : (
          filtered.map((b) => {
            const dog = dogById(b.dogId)
            const owner = userById(b.ownerId)
            const meta = STATUS_META[b.status]
            return (
              <div key={b.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={dog?.photos?.[0]}
                      alt={dog?.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div>
                      <Link to={`/dogs/${dog?.id}`} className="font-bold text-slate-900 hover:text-brand-600">
                        {dog?.name}
                      </Link>
                      <p className="text-sm text-slate-500">Owner: {owner?.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-600">
                        <CalendarClock className="h-4 w-4" />
                        {formatDate(b.date)} · {b.start}–{b.end}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${meta.cls}`}>{meta.label}</span>
                </div>

                {b.status === 'approved' && (
                  <p className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    <Sparkles className="h-4 w-4" /> Confirmed! Enjoy your time with {dog?.name}.
                  </p>
                )}

                {b.status === 'proposed' && b.proposed && (
                  <div className="mt-3 rounded-xl bg-brand-50 p-4">
                    <p className="text-sm text-brand-800">
                      {owner?.name?.split(' ')[0]} suggested a new time:{' '}
                      <strong>{formatDate(b.proposed.date)}</strong> at{' '}
                      <strong>{b.proposed.start}–{b.proposed.end}</strong>.
                    </p>
                    {b.ownerMessage && (
                      <p className="mt-1 text-sm italic text-brand-700">“{b.ownerMessage}”</p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => acceptProposal(b.id)} className="btn bg-emerald-600 text-white hover:bg-emerald-700 py-2">
                        <Check className="h-4 w-4" /> Accept new time
                      </button>
                      <button onClick={() => cancelBooking(b.id)} className="btn-ghost py-2">
                        <X className="h-4 w-4" /> Decline
                      </button>
                    </div>
                  </div>
                )}

                {b.status === 'declined' && b.ownerMessage && (
                  <p className="mt-2 text-sm text-slate-500">Owner’s note: {b.ownerMessage}</p>
                )}

                {b.status === 'pending' && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Waiting for {owner?.name?.split(' ')[0]} to respond.</p>
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="text-sm font-semibold text-slate-400 hover:text-rose-600"
                    >
                      Cancel request
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
