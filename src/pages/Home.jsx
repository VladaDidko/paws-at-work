import { Link } from 'react-router-dom'
import {
  HeartPulse,
  Users,
  Activity,
  ArrowRight,
  PawPrint,
  Dog,
  HandHeart,
  CalendarCheck,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import DogCard from '../components/DogCard.jsx'

const benefits = [
  {
    icon: HeartPulse,
    title: 'Boosts your mood',
    text: 'Interacting with dogs releases oxytocin, dopamine and serotonin, the chemistry behind calm, connection and happiness.',
  },
  {
    icon: Activity,
    title: 'Gets you moving',
    text: 'A lunchtime walk along the canal with a furry friend adds gentle movement and daylight to your workday.',
  },
  {
    icon: Users,
    title: 'Builds connection',
    text: 'Dogs are natural ice-breakers. Sharing time around them sparks conversations across teams and floors.',
  },
]

const steps = [
  {
    icon: Dog,
    title: 'Owners share their dog',
    text: 'Add a profile with photos, a description and the times your dog is available to hang out at the office.',
  },
  {
    icon: HandHeart,
    title: 'Supporters book a moment',
    text: 'Browse the catalogue, pick a dog, and request a date & time that works for you.',
  },
  {
    icon: CalendarCheck,
    title: 'Owners confirm',
    text: 'Owners approve, suggest another time, or decline — and everyone gets their well-being dose of dog.',
  },
]

export default function Home() {
  const { dogs, currentUser } = useApp()
  const featured = dogs.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-sand-50 to-white" />
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="badge bg-brand-100 text-brand-700">
              <PawPrint className="h-3.5 w-3.5" /> Adyen Amsterdam wellbeing
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              A little time with a dog,
              <span className="text-brand-600"> a lot more wellbeing.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              Adyen Dog Connect links Adyeners who own dogs with teammates who’d love to share a
              walk, a cuddle or a play break. Less stress, more smiles — right at the office.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogue" className="btn-primary text-base">
                Meet the dogs <ArrowRight className="h-4 w-4" />
              </Link>
              {!currentUser && (
                <Link to="/signup" className="btn-ghost text-base">
                  Sign up
                </Link>
              )}
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div>
                <p className="text-5xl font-extrabold text-slate-900">{dogs.length}</p>
                <p>office dogs</p>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-up">
            <img
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&q=80"
              alt="Happy dog"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-soft"
            />
            <div className="card absolute -bottom-6 -left-6 hidden w-56 p-4 sm:block">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <HeartPulse className="h-4 w-4 text-rose-500" /> Science says
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Petting a dog for just 10 minutes significantly lowers stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-emerald-100 text-emerald-700">Why dogs are good for you</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            The mental-health case for office dogs
          </h2>
          <p className="mt-3 text-slate-600">
            Spending time around dogs has measurable benefits for mind and body. Here’s what a few
            minutes a day can do.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="card p-6 transition-all hover:-translate-y-1 hover:shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{b.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-brand-100 text-brand-700">How it works</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Two roles, one happy office
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative card p-6">
                <span className="absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-sand-100 text-brand-600">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
              <Dog className="h-8 w-8" />
              <h3 className="mt-4 text-xl font-bold">I have a dog</h3>
              <p className="mt-2 text-sm text-brand-100">
                Share your best friend with the team and brighten someone’s day. You stay in full
                control of when and with whom.
              </p>
              <Link
                to="/signup?role=owner"
                className="btn mt-5 bg-white text-brand-700 hover:bg-brand-50"
              >
                Join as a Dog Owner <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-ink-700 to-ink-900 p-8 text-white">
              <HandHeart className="h-8 w-8 text-brand-400" />
              <h3 className="mt-4 text-xl font-bold">I want dog time</h3>
              <p className="mt-2 text-sm text-slate-300">
                No dog of your own? Book a walk, a play session or a cuddle break with a colleague’s
                dog whenever you need a reset.
              </p>
              <Link
                to="/signup?role=supporter"
                className="btn mt-5 bg-brand-500 text-white hover:bg-brand-400"
              >
                Join as a Dog Supporter <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured dogs */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="badge bg-amber-100 text-amber-700">Catalogue</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Meet a few good dogs
            </h2>
          </div>
          <Link to="/catalogue" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/catalogue" className="btn-soft">
            View all dogs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
