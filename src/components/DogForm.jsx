import { useRef, useState } from 'react'
import { Plus, Trash2, Clock, Upload, Link2, X } from 'lucide-react'
import { WEEKDAYS } from '../data/seed.js'

const SIZES = ['Small', 'Medium', 'Large']
const ENERGY = ['Low', 'Medium', 'High']

const uid = () => Math.random().toString(36).slice(2, 9)

const empty = {
  name: '',
  breed: '',
  age: '',
  size: 'Medium',
  energy: 'Medium',
  location: '',
  bio: '',
  traits: [],
  photos: [],
  availability: [{ id: uid(), day: 'Monday', start: '12:00', end: '13:00' }],
}

export default function DogForm({ initial, onSubmit, onCancel, submitLabel = 'Save dog' }) {
  const [form, setForm] = useState(() => {
    if (!initial) return empty
    return {
      ...initial,
      photos: initial.photos || [],
      traits: initial.traits || [],
    }
  })
  const [traitInput, setTraitInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const addPhoto = (src) => setForm((f) => ({ ...f, photos: [...f.photos, src] }))
  const removePhoto = (i) =>
    setForm((f) => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }))

  function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => addPhoto(reader.result)
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function addUrl() {
    const u = urlInput.trim()
    if (u) addPhoto(u)
    setUrlInput('')
  }

  function addTrait() {
    const t = traitInput.trim()
    if (t && !form.traits.includes(t)) set('traits', [...form.traits, t])
    setTraitInput('')
  }
  const removeTrait = (t) => set('traits', form.traits.filter((x) => x !== t))

  function setSlot(id, key, v) {
    set(
      'availability',
      form.availability.map((s) => (s.id === id ? { ...s, [key]: v } : s)),
    )
  }
  const addSlot = () =>
    set('availability', [
      ...form.availability,
      { id: uid(), day: 'Monday', start: '12:00', end: '13:00' },
    ])
  const removeSlot = (id) => set('availability', form.availability.filter((s) => s.id !== id))

  function submit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.breed || !form.bio) {
      return setError('Name, breed and description are required.')
    }
    const photos = form.photos.map((p) => p.trim()).filter(Boolean)
    onSubmit({
      ...form,
      age: Number(form.age) || 0,
      photos,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Dog's name">
          <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Pixel" />
        </Field>
        <Field label="Breed">
          <input className="input" value={form.breed} onChange={(e) => set('breed', e.target.value)} placeholder="e.g. Golden Retriever" />
        </Field>
        <Field label="Age (years)">
          <input type="number" min="0" className="input" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="3" />
        </Field>
        <Field label="Office location">
          <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Rokin HQ — 3rd floor" />
        </Field>
        <Field label="Size">
          <select className="input" value={form.size} onChange={(e) => set('size', e.target.value)}>
            {SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Energy level">
          <select className="input" value={form.energy} onChange={(e) => set('energy', e.target.value)}>
            {ENERGY.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea
          className="input resize-none"
          rows={4}
          value={form.bio}
          onChange={(e) => set('bio', e.target.value)}
          placeholder="Tell supporters about your dog's personality, what they love, and how they are at the office."
        />
      </Field>

      {/* Traits */}
      <Field label="Traits">
        <div className="flex gap-2">
          <input
            className="input"
            value={traitInput}
            onChange={(e) => setTraitInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTrait()
              }
            }}
            placeholder="e.g. Gentle, then press Enter"
          />
          <button type="button" onClick={addTrait} className="btn-soft shrink-0">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {form.traits.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.traits.map((t) => (
              <span key={t} className="badge bg-brand-50 text-brand-700">
                {t}
                <button type="button" onClick={() => removeTrait(t)} className="ml-1 text-brand-400 hover:text-rose-500">
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>

      {/* Photos */}
      <Field label="Photos">
        {/* Thumbnails */}
        {form.photos.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {form.photos.map((p, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-slate-200">
                <img src={p} alt={`Dog photo ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100"
                  title="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload from device */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 bg-sand-50 px-4 py-6 text-sm text-slate-500 transition hover:border-brand-400 hover:text-brand-600"
        >
          <Upload className="h-6 w-6" />
          <span className="font-semibold">Upload photos from your device</span>
          <span className="text-xs text-slate-400">PNG or JPG — you can select multiple</span>
        </button>

        {/* Or add by URL */}
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addUrl()
                }
              }}
              placeholder="…or paste an image URL"
            />
          </div>
          <button type="button" onClick={addUrl} className="btn-soft shrink-0">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </Field>

      {/* Availability */}
      <Field label="Weekly availability">
        <div className="space-y-2">
          {form.availability.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-sand-50 p-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <select
                className="input max-w-[10rem]"
                value={s.day}
                onChange={(e) => setSlot(s.id, 'day', e.target.value)}
              >
                {WEEKDAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <input type="time" className="input max-w-[8rem]" value={s.start} onChange={(e) => setSlot(s.id, 'start', e.target.value)} />
              <span className="text-slate-400">–</span>
              <input type="time" className="input max-w-[8rem]" value={s.end} onChange={(e) => setSlot(s.id, 'end', e.target.value)} />
              <button type="button" onClick={() => removeSlot(s.id)} className="ml-auto text-slate-400 hover:text-rose-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSlot} className="btn-soft mt-2">
          <Plus className="h-4 w-4" /> Add a time slot
        </button>
      </Field>

      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
