import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Dog as DogIcon,
  Inbox,
  Check,
  X,
  CalendarClock,
  Clock,
  Pencil,
  Trash2,
  MapPin,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import DogForm from '../components/DogForm.jsx'
import { formatDate, weekdayOf, todayStr, STATUS_META } from '../lib/utils.js'

export default function OwnerDashboard() {
  const {
    currentUser,
    dogs,
    bookings,
    addDog,
    updateDog,
    removeDog,
    userById,
    dogById,
    approveBooking,
    declineBooking,
    proposeNewTime,
  } = useApp()

  const [tab, setTab] = useState('requests')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const myDogs = useMemo(
    () => dogs.filter((d) => d.ownerId === currentUser.id),
    [dogs, currentUser],
  )
  const myDogIds = myDogs.map((d) => d.id)
  const myBookings = useMemo(
    () =>
      bookings
        .filter((b) => myDogIds.includes(b.dogId))
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [bookings, myDogIds],
  )
  const pendingCount = myBookings.filter((b) => b.status === 'pending').length
  const approvedCount = myBookings.filter((b) => b.status === 'approved').length

  function handleAdd(data) {
    addDog(data)
    setShowForm(false)
    setTab('dogs')
  }
  function handleEdit(data) {
    updateDog(editing.id, data)
    setEditing(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-600">Owner dashboard</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Hi {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-slate-600">Manage your dogs and respond to booking requests.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((s) => !s)
            setEditing(null)
            setTab('dogs')
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Add a dog
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={DogIcon} label="My dogs" value={myDogs.length} />
        <StatCard icon={Inbox} label="Pending requests" value={pendingCount} accent="amber" />
        <StatCard icon={CalendarClock} label="Approved visits" value={approvedCount} accent="emerald" />
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-slate-200">
        <TabBtn active={tab === 'requests'} onClick={() => setTab('requests')}>
          Requests {pendingCount > 0 && <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-xs text-white">{pendingCount}</span>}
        </TabBtn>
        <TabBtn active={tab === 'dogs'} onClick={() => setTab('dogs')}>
          My dogs
        </TabBtn>
      </div>

      {/* Add / edit form */}
      {(showForm || editing) && tab === 'dogs' && (
        <div className="card mt-6 p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            {editing ? `Edit ${editing.name}` : 'Add a new dog'}
          </h2>
          <DogForm
            initial={editing || undefined}
            submitLabel={editing ? 'Save changes' : 'Add dog'}
            onSubmit={editing ? handleEdit : handleAdd}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      {/* Requests tab */}
      {tab === 'requests' && (
        <div className="mt-6 space-y-4">
          {myBookings.length === 0 ? (
            <Empty icon={Inbox} text="No booking requests yet. Once you publish a dog, supporters can request time." />
          ) : (
            myBookings.map((b) => (
              <OwnerRequestCard
                key={b.id}
                booking={b}
                dog={dogById(b.dogId)}
                supporter={userById(b.supporterId)}
                onApprove={approveBooking}
                onDecline={declineBooking}
                onPropose={proposeNewTime}
              />
            ))
          )}
        </div>
      )}

      {/* Dogs tab */}
      {tab === 'dogs' && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {myDogs.length === 0 && !showForm ? (
            <Empty icon={DogIcon} text="You haven't added a dog yet. Click “Add a dog” to share your best friend." />
          ) : (
            myDogs.map((dog) => (
              <div key={dog.id} className="card overflow-hidden">
                <div className="flex gap-4 p-4">
                  <img
                    src={dog.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&q=80'}
                    alt={dog.name}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">{dog.name}</h3>
                      <span className="text-sm text-slate-400">{dog.breed}</span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" /> {dog.location}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {dog.availability?.length || 0} weekly slots
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(dog)
                          setShowForm(false)
                        }}
                        className="btn-soft py-1.5 text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <Link to={`/dogs/${dog.id}`} className="btn-ghost py-1.5 text-xs">
                        View
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${dog.name}? This also cancels their bookings.`)) {
                            removeDog(dog.id)
                          }
                        }}
                        className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function OwnerRequestCard({ booking, dog, supporter, onApprove, onDecline, onPropose }) {
  const [mode, setMode] = useState(null) // 'propose'
  const [message, setMessage] = useState('')
  const [proposed, setProposed] = useState({ date: booking.date, start: booking.start, end: booking.end })
  const meta = STATUS_META[booking.status]
  const isActionable = booking.status === 'pending'

  function submitPropose(e) {
    e.preventDefault()
    if (weekdayOf(proposed.date) && proposed.date) {
      onPropose(booking.id, proposed, message)
      setMode(null)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={dog?.photos?.[0]}
            alt={dog?.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div>
            <p className="font-bold text-slate-900">
              {supporter?.name} wants time with {dog?.name}
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-500">
              <CalendarClock className="h-4 w-4" />
              {formatDate(booking.date)} · {booking.start}–{booking.end}
            </p>
          </div>
        </div>
        <span className={`badge ${meta.cls}`}>{meta.label}</span>
      </div>

      {booking.note && (
        <p className="mt-3 rounded-xl bg-sand-50 p-3 text-sm italic text-slate-600">
          “{booking.note}”
        </p>
      )}

      {booking.status === 'proposed' && booking.proposed && (
        <p className="mt-3 rounded-xl bg-brand-50 p-3 text-sm text-brand-700">
          You proposed: <strong>{formatDate(booking.proposed.date)}</strong> at{' '}
          <strong>{booking.proposed.start}–{booking.proposed.end}</strong>. Waiting for {supporter?.name?.split(' ')[0]} to confirm.
        </p>
      )}
      {booking.ownerMessage && booking.status !== 'pending' && (
        <p className="mt-2 text-sm text-slate-500">Your note: {booking.ownerMessage}</p>
      )}

      {isActionable && mode !== 'propose' && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => onApprove(booking.id)} className="btn bg-emerald-600 text-white hover:bg-emerald-700">
            <Check className="h-4 w-4" /> Approve
          </button>
          <button onClick={() => setMode('propose')} className="btn-soft">
            <Clock className="h-4 w-4" /> Suggest another time
          </button>
          <button
            onClick={() => onDecline(booking.id)}
            className="btn bg-white text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50"
          >
            <X className="h-4 w-4" /> Decline
          </button>
        </div>
      )}

      {mode === 'propose' && (
        <form onSubmit={submitPropose} className="mt-4 space-y-3 rounded-xl bg-sand-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Propose a new time</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              min={todayStr()}
              value={proposed.date}
              onChange={(e) => setProposed((p) => ({ ...p, date: e.target.value }))}
              className="input max-w-[12rem]"
            />
            <input
              type="time"
              value={proposed.start}
              onChange={(e) => setProposed((p) => ({ ...p, start: e.target.value }))}
              className="input max-w-[8rem]"
            />
            <span className="text-slate-400">–</span>
            <input
              type="time"
              value={proposed.end}
              onChange={(e) => setProposed((p) => ({ ...p, end: e.target.value }))}
              className="input max-w-[8rem]"
            />
          </div>
          {proposed.date && (
            <p className="text-xs text-slate-500">That’s a {weekdayOf(proposed.date)}.</p>
          )}
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional message to the supporter"
            className="input"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary py-2">Send proposal</button>
            <button type="button" onClick={() => setMode(null)} className="btn-ghost py-2">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${accents[accent]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
        active ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

function Empty({ icon: Icon, text }) {
  return (
    <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
      <Icon className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">{text}</p>
    </div>
  )
}
