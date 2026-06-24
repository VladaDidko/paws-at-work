import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedUsers, seedDogs, seedBookings } from '../data/seed.js'

const AppContext = createContext(null)

const KEYS = {
  users: 'paws_users',
  dogs: 'paws_dogs',
  bookings: 'paws_bookings',
  session: 'paws_session',
  activeRole: 'paws_active_role',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => load(KEYS.users, seedUsers))
  const [dogs, setDogs] = useState(() => load(KEYS.dogs, seedDogs))
  const [bookings, setBookings] = useState(() => load(KEYS.bookings, seedBookings))
  const [sessionId, setSessionId] = useState(() => load(KEYS.session, null))
  // The interface the user is currently viewing ('owner' | 'supporter').
  // Every signed-in member can switch between both interfaces.
  const [activeRole, setActiveRole] = useState(() => load(KEYS.activeRole, null))

  useEffect(() => localStorage.setItem(KEYS.users, JSON.stringify(users)), [users])
  useEffect(() => localStorage.setItem(KEYS.dogs, JSON.stringify(dogs)), [dogs])
  useEffect(() => localStorage.setItem(KEYS.bookings, JSON.stringify(bookings)), [bookings])
  useEffect(() => localStorage.setItem(KEYS.session, JSON.stringify(sessionId)), [sessionId])
  useEffect(() => localStorage.setItem(KEYS.activeRole, JSON.stringify(activeRole)), [activeRole])

  const currentUser = useMemo(
    () => users.find((u) => u.id === sessionId) || null,
    [users, sessionId],
  )

  // Keep activeRole valid: default to the signup role when missing.
  useEffect(() => {
    if (currentUser && !activeRole) setActiveRole(currentUser.role)
    if (!currentUser && activeRole) setActiveRole(null)
  }, [currentUser, activeRole])

  // ---- Auth ----
  function signup({ name, email, password, role }) {
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) return { error: 'An account with this email already exists.' }
    const user = { id: uid('u'), name, email, password, role }
    setUsers((prev) => [...prev, user])
    setSessionId(user.id)
    setActiveRole(role)
    return { user }
  }

  function login({ email, password }) {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )
    if (!user) return { error: 'Invalid email or password.' }
    setSessionId(user.id)
    setActiveRole(user.role)
    return { user }
  }

  function logout() {
    setSessionId(null)
    setActiveRole(null)
  }

  // ---- Dogs ----
  function addDog(data) {
    if (!currentUser) return { error: 'Not signed in.' }
    const dog = {
      id: uid('d'),
      ownerId: currentUser.id,
      photos: [],
      traits: [],
      availability: [],
      ...data,
    }
    setDogs((prev) => [...prev, dog])
    return { dog }
  }

  function updateDog(dogId, patch) {
    setDogs((prev) => prev.map((d) => (d.id === dogId ? { ...d, ...patch } : d)))
  }

  function removeDog(dogId) {
    setDogs((prev) => prev.filter((d) => d.id !== dogId))
    setBookings((prev) => prev.filter((b) => b.dogId !== dogId))
  }

  // ---- Bookings ----
  function requestBooking({ dogId, date, start, end, note }) {
    const dog = dogs.find((d) => d.id === dogId)
    if (!dog || !currentUser) return { error: 'Unable to create booking.' }
    const booking = {
      id: uid('b'),
      dogId,
      supporterId: currentUser.id,
      ownerId: dog.ownerId,
      date,
      start,
      end,
      note: note || '',
      status: 'pending',
      ownerMessage: '',
      proposed: null,
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [booking, ...prev])
    return { booking }
  }

  function updateBooking(bookingId, patch) {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, ...patch } : b)))
  }

  function approveBooking(bookingId, message = '') {
    updateBooking(bookingId, { status: 'approved', ownerMessage: message, proposed: null })
  }

  function declineBooking(bookingId, message = '') {
    updateBooking(bookingId, { status: 'declined', ownerMessage: message })
  }

  function proposeNewTime(bookingId, proposed, message = '') {
    updateBooking(bookingId, { status: 'proposed', proposed, ownerMessage: message })
  }

  function acceptProposal(bookingId) {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId && b.proposed
          ? {
              ...b,
              date: b.proposed.date,
              start: b.proposed.start,
              end: b.proposed.end,
              status: 'approved',
              proposed: null,
            }
          : b,
      ),
    )
  }

  function cancelBooking(bookingId) {
    updateBooking(bookingId, { status: 'cancelled' })
  }

  // ---- Selectors ----
  const userById = (id) => users.find((u) => u.id === id)
  const dogById = (id) => dogs.find((d) => d.id === id)

  const value = {
    users,
    dogs,
    bookings,
    currentUser,
    activeRole,
    setActiveRole,
    // auth
    signup,
    login,
    logout,
    // dogs
    addDog,
    updateDog,
    removeDog,
    // bookings
    requestBooking,
    approveBooking,
    declineBooking,
    proposeNewTime,
    acceptProposal,
    cancelBooking,
    // selectors
    userById,
    dogById,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
