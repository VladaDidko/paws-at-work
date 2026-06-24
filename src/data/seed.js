// Seed data used the first time the app loads (persisted to localStorage afterwards).

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const seedUsers = [
  {
    id: 'u-owner-1',
    name: 'Sanne de Vries',
    email: 'sanne@adyen.com',
    password: 'demo',
    role: 'owner',
  },
  {
    id: 'u-owner-2',
    name: 'Liam Bakker',
    email: 'liam@adyen.com',
    password: 'demo',
    role: 'owner',
  },
  {
    id: 'u-supporter-1',
    name: 'Maya Jansen',
    email: 'maya@adyen.com',
    password: 'demo',
    role: 'supporter',
  },
]

export const seedDogs = [
  {
    id: 'd-1',
    ownerId: 'u-owner-1',
    name: 'Pixel',
    breed: 'Golden Retriever',
    age: 3,
    size: 'Large',
    energy: 'Medium',
    location: 'Rokin HQ — 3rd floor',
    bio: "Pixel is a sunshine-in-fur-form Golden who lives for belly rubs and tennis balls. He's calm at the desk and loves a midday canal-side walk. Great with first-time supporters!",
    traits: ['Gentle', 'Loves walks', 'Office-trained', 'Hypoallergenic-ish'],
    photos: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
    ],
    availability: [
      { id: 's1', day: 'Monday', start: '12:00', end: '13:00' },
      { id: 's2', day: 'Wednesday', start: '15:00', end: '16:00' },
      { id: 's3', day: 'Friday', start: '12:30', end: '13:30' },
    ],
  },
  {
    id: 'd-2',
    ownerId: 'u-owner-1',
    name: 'Mochi',
    breed: 'Shiba Inu',
    age: 2,
    size: 'Small',
    energy: 'High',
    location: 'Rokin HQ — Garden',
    bio: 'Mochi is a curious little fox-dog with big opinions and bigger zoomies. A short play session with Mochi is the ultimate stress-reset between meetings.',
    traits: ['Playful', 'Curious', 'Quick walks', 'Treat-motivated'],
    photos: [
      'https://images.unsplash.com/photo-1593134257782-e89567b7718a?w=800&q=80',
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80',
    ],
    availability: [
      { id: 's4', day: 'Tuesday', start: '11:00', end: '11:45' },
      { id: 's5', day: 'Thursday', start: '14:00', end: '14:45' },
    ],
  },
  {
    id: 'd-3',
    ownerId: 'u-owner-2',
    name: 'Biscuit',
    breed: 'Cavapoo',
    age: 4,
    size: 'Small',
    energy: 'Low',
    location: 'Rokin HQ — Quiet zone',
    bio: 'Biscuit is a fluffy lap-loving cuddle expert. Perfect for a calm coffee-break companion if you just need a soft, snoozy friend nearby while you decompress.',
    traits: ['Cuddly', 'Calm', 'Lap dog', 'Hypoallergenic'],
    photos: [
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=800&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    ],
    availability: [
      { id: 's6', day: 'Monday', start: '10:00', end: '10:45' },
      { id: 's7', day: 'Wednesday', start: '13:00', end: '13:45' },
      { id: 's8', day: 'Friday', start: '16:00', end: '16:45' },
    ],
  },
]

export const seedBookings = [
  {
    id: 'b-1',
    dogId: 'd-1',
    supporterId: 'u-supporter-1',
    ownerId: 'u-owner-1',
    date: nextDateForWeekday('Monday'),
    start: '12:00',
    end: '13:00',
    note: 'Would love a lunchtime walk along the canal!',
    status: 'pending',
    ownerMessage: '',
    proposed: null,
    createdAt: new Date().toISOString(),
  },
]

function nextDateForWeekday(weekday) {
  const map = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }
  const today = new Date()
  const target = map[weekday]
  const diff = (target - today.getDay() + 7) % 7 || 7
  const d = new Date(today)
  d.setDate(today.getDate() + diff)
  return d.toISOString().slice(0, 10)
}
