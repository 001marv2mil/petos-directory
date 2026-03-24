import { useState } from 'react'
import { PawPrint, Plus, Trash2, ExternalLink } from 'lucide-react'
import { usePets } from '@/hooks/usePets'
import { useAuth } from '@/context/AuthContext'

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile', 'Other']

const PET_EMOJI: Record<string, string> = {
  dog: '🐶', cat: '🐱', bird: '🐦', rabbit: '🐰', reptile: '🦎', other: '🐾',
}

export function MyPets() {
  const { pets, loading, addPet, deletePet } = usePets()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Dog', breed: '', birthday: '' })
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const err = await addPet({
      name: form.name.trim(),
      type: form.type.toLowerCase(),
      breed: form.breed.trim() || undefined,
      birthday: form.birthday || undefined,
    })
    setSubmitting(false)
    if (err) {
      setError('Could not save pet. Please try again.')
    } else {
      setForm({ name: '', type: 'Dog', breed: '', birthday: '' })
      setShowForm(false)
    }
  }

  const petNames = pets.map(p => p.name)
  const petosHealthUrl = pets.length > 0
    ? `https://petoshealth.com/onboard?` + pets.map((p, i) =>
        `pet${i}_name=${encodeURIComponent(p.name)}&pet${i}_type=${encodeURIComponent(p.type)}${p.breed ? `&pet${i}_breed=${encodeURIComponent(p.breed)}` : ''}${p.birthday ? `&pet${i}_birthday=${encodeURIComponent(p.birthday)}` : ''}`
      ).join('&') + `&source=petos_directory&email=${encodeURIComponent(user?.email ?? '')}`
    : 'https://petoshealth.com'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PawPrint className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-900">My Pets</h2>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Pet
          </button>
        )}
      </div>

      {/* Pet list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : pets.length === 0 && !showForm ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <span className="text-4xl">🐾</span>
          <p className="mt-3 font-semibold text-gray-700">No pets added yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your pet to get personalized care recommendations</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Add your first pet
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {pets.map(pet => (
            <div key={pet.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-2xl">{PET_EMOJI[pet.type] ?? '🐾'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{pet.name}</p>
                <p className="text-xs text-gray-400 capitalize">
                  {pet.type}{pet.breed ? ` · ${pet.breed}` : ''}{pet.birthday ? ` · Born ${new Date(pet.birthday).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                </p>
              </div>
              <button
                onClick={() => deletePet(pet.id)}
                className="text-gray-300 hover:text-red-400 transition-colors"
                aria-label="Remove pet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add pet form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm">Add a pet</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Max"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type *</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {PET_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Breed</label>
              <input
                type="text"
                placeholder="e.g. Golden Retriever"
                value={form.breed}
                onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Birthday</label>
              <input
                type="date"
                value={form.birthday}
                onChange={e => setForm(f => ({ ...f, birthday: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save Pet'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(null) }}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* PetOS Health upsell — only shows when they have at least one pet */}
      {pets.length > 0 && (
        <a
          href={petosHealthUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:border-blue-300 hover:bg-blue-100 transition-colors group"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-blue-900 text-sm">
              {pets.length === 1
                ? `${pets[0].name} is ready on PetOS Health`
                : `${petNames.slice(0, -1).join(', ')} & ${petNames[petNames.length - 1]} are ready on PetOS Health`}
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Track vet visits, vaccines & health records — no re-adding needed
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600 shrink-0 transition-colors" />
        </a>
      )}
    </div>
  )
}
