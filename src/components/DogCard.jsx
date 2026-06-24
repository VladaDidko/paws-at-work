import { Link } from 'react-router-dom'
import { MapPin, Heart, Calendar } from 'lucide-react'

export default function DogCard({ dog }) {
  const cover = dog.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80'
  return (
    <Link
      to={`/dogs/${dog.id}`}
      className="card group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={cover}
          alt={dog.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="badge absolute left-3 top-3 bg-white/90 text-slate-700 backdrop-blur">
          {dog.breed}
        </span>
        <span className="badge absolute right-3 top-3 bg-brand-600/90 text-white backdrop-blur">
          <Calendar className="h-3 w-3" />
          {dog.availability?.length || 0} slots
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{dog.name}</h3>
          <span className="text-sm font-medium text-slate-400">{dog.age} yrs</span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {dog.location}
        </p>
        <p className="mt-3 line-clamp-2 text-sm text-slate-600">{dog.bio}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {dog.traits?.slice(0, 3).map((t) => (
            <span key={t} className="badge bg-sand-100 text-slate-600">
              {t}
            </span>
          ))}
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
          <Heart className="h-4 w-4" />
          Spend time with {dog.name}
        </span>
      </div>
    </Link>
  )
}
