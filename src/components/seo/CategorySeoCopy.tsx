interface Props {
  categoryLabel: string
  categoryPluralLabel: string
  categoryDescription: string
  city: string
  state: string
  stateAbbr: string
  total?: number
}

export function CategorySeoCopy({ categoryLabel, categoryPluralLabel, categoryDescription, city, state, stateAbbr, total }: Props) {
  return (
    <section className="prose prose-sm text-gray-500 pt-6 border-t border-gray-100 max-w-3xl space-y-4 leading-relaxed">
      <p>
        Looking for {categoryPluralLabel.toLowerCase()} in {city}, {state}?
        PetOS Directory lists {total ? `${total}+ ` : ''}local {categoryLabel.toLowerCase()} professionals
        in {city}, {stateAbbr} with verified contact information, ratings, hours, and service details.
        Every listing is sourced directly from Google Places and updated regularly to ensure accuracy.
      </p>
      <p>
        <strong className="text-gray-600">{categoryDescription}</strong>{' '}
        When choosing a {categoryLabel.toLowerCase()} in {city}, consider their Google rating, number of
        reviews, proximity to your home, and the specific services they offer. PetOS Directory makes it
        easy to compare multiple providers side by side and call directly from any listing.
      </p>
      <p>
        {city}, {state} is served by a broad network of licensed and experienced pet care providers.
        Whether you need routine services or specialized care, the {categoryPluralLabel.toLowerCase()} listed
        here represent the most active and reviewed businesses in the {city} area.
        Sign up free to save your favorites and get notified when new providers are added near you.
      </p>
      <p className="text-xs text-gray-400">
        PetOS Directory · {categoryPluralLabel} in {city}, {state} ·
        Data sourced from Google Places. Updated regularly.
      </p>
    </section>
  )
}
