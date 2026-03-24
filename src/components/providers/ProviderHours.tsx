import type { WeeklyHours } from '@/types'

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const

function format12h(time: string | null): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return m === 0 ? `${hour} ${ampm}` : `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

function isOpen(hours: WeeklyHours): boolean {
  const now = new Date()
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  const todayKey = dayKeys[now.getDay()]
  const today = hours[todayKey]
  if (today.closed || !today.open || !today.close) return false
  const [oh, om] = today.open.split(':').map(Number)
  const [ch, cm] = today.close.split(':').map(Number)
  const current = now.getHours() * 60 + now.getMinutes()
  return current >= oh * 60 + om && current < ch * 60 + cm
}

interface ProviderHoursProps {
  hours: WeeklyHours
}

export function ProviderHours({ hours }: ProviderHoursProps) {
  const open = isOpen(hours)

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full ${
          open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${open ? 'bg-green-500' : 'bg-gray-400'}`} />
          {open ? 'Open Now' : 'Closed'}
        </span>
      </div>

      <table className="w-full text-sm">
        <tbody>
          {DAYS.map(({ key, label }) => {
            const day = hours[key]
            const todayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()]
            const isToday = key === todayKey
            return (
              <tr key={key} className={isToday ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                <td className="py-1 w-28">{label}</td>
                <td className="py-1">
                  {day.closed
                    ? <span className="text-gray-400">Closed</span>
                    : day.open === '00:00' && day.close === '23:59'
                    ? <span className="text-green-600">24 Hours</span>
                    : `${format12h(day.open)} – ${format12h(day.close)}`
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
