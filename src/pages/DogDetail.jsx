import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  MapPin,
  ArrowLeft,
  Check,
  CalendarHeart,
  Clock,
  Sparkles,
  Dog as DogIcon,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { formatDate, weekdayOf, todayStr } from '../lib/utils.js'

const WEEKDAY_INDEX = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

function nextDateForWeekday(weekday) {
  const today = new Date()
  const target = WEEKDAY_INDEX[weekday]
  const diff = (target - today.getDay() + 7) % 7 || 7
  const d = new Date(today)
  d.setDate(today.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

export default function DogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dogById, userById, currentUser, activeRole, requestBooking } = useApp()

  const dog = dogById(id)
  const [activePhoto, setActivePhoto] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const owner = useMemo(() => (dog ? userById(dog.ownerId) : null), [dog, userById])

  if (!dog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <DogIcon className="mx-auto h-12 w-12 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Dog not found</h1>
        <Link to="/catalogue" className="btn-primary mt-6">
          Back to catalogue
        </Link>
      </div>
    )
  }

  const isOwnerOfDog = currentUser?.id === dog.ownerId
  const canBook = activeRole === 'supporter'

  function chooseSlot(slot) {
    setSelectedSlot(slot)
    setDate(nextDateForWeekday(slot.day))
    setError('')
  }

  function submit(e) {
    e.preventDefault()
    setError('')
    if (!selectedSlot) return setError('Please choose an availability slot.')
    if (!date) return setError('Please pick a date.')
    if (weekdayOf(date) !== selectedSlot.day) {
      return setError(`The date must fall on a ${selectedSlot.day}.`)
    }
    requestBooking({
      dogId: dog.id,
      date,
      start: selectedSlot.start,
      end: selectedSlot.end,
      note,
    })
    setDone(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery + info */}
        <div>
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <img
              src={dog.photos?.[activePhoto] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80'}
              alt={dog.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {dog.photos?.length > 1 && (
            <div className="mt-3 flex gap-3">
              {dog.photos.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setActivePhoto(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl ring-2 transition ${
                    i === activePhoto ? 'ring-brand-500' : 'ring-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{dog.name}</h1>
              <span className="badge bg-sand-100 text-slate-600">{dog.breed}</span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4" /> {dog.location}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat label="Age" value={`${dog.age} yrs`} />
              <Stat label="Size" value={dog.size} />
              <Stat label="Energy" value={dog.energy} />
            </div>

            <p className="mt-6 leading-relaxed text-slate-600">{dog.bio}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {dog.traits?.map((t) => (
                <span key={t} className="badge bg-brand-50 text-brand-700">
                  <Sparkles className="h-3 w-3" /> {t}
                </span>
              ))}
            </div>

            {owner && (
              <p className="mt-6 text-sm text-slate-500">
                Cared for by <span className="font-semibold text-slate-700">{owner.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Booking panel */}
        <div>
          <div className="card sticky top-24 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <CalendarHeart className="h-5 w-5 text-brand-600" /> Book time with {dog.name}
            </h2>

            {done ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-6 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-6 w-6" />
                </span>
                <h3 className="mt-3 text-lg font-bold text-emerald-800">Request sent!</h3>
                <p className="mt-1 text-sm text-emerald-700">
                  {owner?.name?.split(' ')[0] || 'The owner'} will review your request for{' '}
                  <strong>{formatDate(date)}</strong> at <strong>{selectedSlot?.start}</strong>.
                </p>
                <Link to="/supporter" className="btn-primary mt-4">
                  View my bookings
                </Link>
              </div>
            ) : isOwnerOfDog ? (
              <p className="mt-6 rounded-xl bg-sand-50 p-4 text-sm text-slate-600">
                This is your dog. Manage incoming requests from your{' '}
                <Link to="/owner" className="font-semibold text-brand-600 hover:underline">
                  owner dashboard
                </Link>
                .
              </p>
            ) : !currentUser ? (
              <div className="mt-6">
                <p className="text-sm text-slate-600">
                  Sign in as a Dog Supporter to book time with {dog.name}.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link to="/login" className="btn-ghost flex-1">
                    Log in
                  </Link>
                  <Link to="/signup?role=supporter" className="btn-primary flex-1">
                    Sign up
                  </Link>
                </div>
              </div>
            ) : !canBook ? (
              <p className="mt-6 rounded-xl bg-sand-50 p-4 text-sm text-slate-600">
                You’re viewing the <strong>Owner</strong> interface. Switch to the{' '}
                <strong>Supporter</strong> interface (top-right toggle) to request a booking.
              </p>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                  <p className="label">1. Pick an available slot</p>
                  <div className="grid gap-2">
                    {dog.availability?.length ? (
                      dog.availability.map((slot) => {
                        const active = selectedSlot?.id === slot.id
                        return (
                          <button
                            type="button"
                            key={slot.id}
                            onClick={() => chooseSlot(slot)}
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                              active
                                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-300'
                                : 'border-slate-200 hover:border-brand-300'
                            }`}
                          >
                            <span className="font-semibold text-slate-800">{slot.day}</span>
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Clock className="h-3.5 w-3.5" />
                              {slot.start}–{slot.end}
                            </span>
                          </button>
                        )
                      })
                    ) : (
                      <p className="text-sm text-slate-500">No availability published yet.</p>
                    )}
                  </div>
                </div>

                {selectedSlot && (
                  <>
                    <div>
                      <label className="label">2. Choose a date (a {selectedSlot.day})</label>
                      <input
                        type="date"
                        min={todayStr()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input"
                      />
                      {date && (
                        <p className="mt-1.5 text-xs text-slate-500">{formatDate(date)}</p>
                      )}
                    </div>

                    <div>
                      <label className="label">3. Add a note (optional)</label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="e.g. I'd love a lunchtime walk by the canal!"
                        className="input resize-none"
                      />
                    </div>
                  </>
                )}

                {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

                <button type="submit" className="btn-primary w-full">
                  Send booking request
                </button>
                <p className="text-center text-xs text-slate-400">
                  {owner?.name?.split(' ')[0] || 'The owner'} can approve, suggest another time, or
                  decline.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-sand-50 p-3 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 font-bold text-slate-800">{value}</p>
    </div>
  )
}
