import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatPhone(phone: string | null): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

export function formatRating(rating: number | null): string {
  if (rating === null) return 'N/A'
  return rating.toFixed(1)
}

export function stateNameFromAbbr(abbr: string): string {
  const map: Record<string, string> = {
    FL: 'Florida', TX: 'Texas', GA: 'Georgia', TN: 'Tennessee',
    NC: 'North Carolina', AZ: 'Arizona', CO: 'Colorado',
    CA: 'California', IL: 'Illinois', NY: 'New York',
  }
  return map[abbr.toUpperCase()] ?? abbr.toUpperCase()
}

export function isOpenNow(hours: Record<string, { open: string | null; close: string | null; closed: boolean }> | null): boolean {
  if (!hours) return false
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const now = new Date()
  const dayName = days[now.getDay()]
  const day = hours[dayName]
  if (!day || day.closed || !day.open || !day.close) return false
  const [oh, om] = day.open.split(':').map(Number)
  const [ch, cm] = day.close.split(':').map(Number)
  const current = now.getHours() * 60 + now.getMinutes()
  const open = oh * 60 + om
  const close = ch * 60 + cm
  return current >= open && current < close
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function categoryLabel(slug: string): string {
  const map: Record<string, string> = {
    veterinarians: 'Veterinarians',
    emergency_vets: 'Emergency Vets',
    groomers: 'Pet Groomers',
    boarding: 'Pet Boarding',
    daycare: 'Dog Daycare',
    trainers: 'Pet Trainers',
    pet_pharmacies: 'Pet Pharmacies',
  }
  return map[slug] ?? slug
}
