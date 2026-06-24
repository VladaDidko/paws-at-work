import { useMemo, useState } from 'react'
import { Search, PawPrint } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import DogCard from '../components/DogCard.jsx'

const SIZES = ['All', 'Small', 'Medium', 'Large']
const ENERGY = ['All', 'Low', 'Medium', 'High']

export default function Catalogue() {
  const { dogs } = useApp()
  const [query, setQuery] = useState('')
  const [size, setSize] = useState('All')
  const [energy, setEnergy] = useState('All')

  const filtered = useMemo(() => {
    return dogs.filter((d) => {
      const matchesQuery =
        !query ||
        [d.name, d.breed, d.bio, ...(d.traits || [])]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      const matchesSize = size === 'All' || d.size === size
      const matchesEnergy = energy === 'All' || d.energy === energy
      return matchesQuery && matchesSize && matchesEnergy
    })
  }, [dogs, query, size, energy])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-2xl">
        <span className="badge bg-brand-100 text-brand-700">
          <PawPrint className="h-3.5 w-3.5" /> The catalogue
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Meet the office dogs
        </h1>
        <p className="mt-2 text-slate-600">
          Browse our four-legged colleagues and find your perfect well-being companion.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, breed or trait…"
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Pill label="Size" value={size} options={SIZES} onChange={setSize} />
          <Pill label="Energy" value={energy} options={ENERGY} onChange={setEnergy} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-slate-500">
          <PawPrint className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-semibold">No dogs match your filters yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  )
}

function Pill({ label, value, options, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-xl bg-sand-50 px-3 py-2 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-semibold text-slate-800 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}
