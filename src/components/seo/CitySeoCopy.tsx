interface Props {
  city: string
  state: string
  stateAbbr: string
  totalProviders?: number
}

export function CitySeoCopy({ city, state, stateAbbr, totalProviders }: Props) {
  return (
    <section className="border-t border-gray-100 pt-10 mt-4">
      <div className="max-w-3xl space-y-6 text-sm text-gray-500 leading-relaxed">
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-2">Pet Care in {city}, {state}</h2>
          <p>
            PetOS Directory is the most comprehensive pet care directory for {city}, {stateAbbr}, listing
            {totalProviders ? ` ${totalProviders}+` : ''} verified local providers including veterinarians,
            emergency animal hospitals, dog groomers, pet boarding facilities, dog daycare centers,
            professional dog trainers, and pet pharmacies. Every listing includes direct contact information,
            hours of operation, customer ratings, and service details sourced from Google Places.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Finding a Veterinarian in {city}</h3>
          <p>
            {city} has a strong network of licensed veterinary clinics offering routine wellness exams,
            vaccinations, dental care, surgery, and specialist referrals. When choosing a vet in {city},
            consider proximity, hours of operation, and whether they accept new patients. PetOS Directory
            shows ratings and review counts so you can compare practices side by side.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Emergency Veterinary Care in {city}, {stateAbbr}</h3>
          <p>
            Pet emergencies require immediate action. {city} has 24/7 emergency animal hospitals equipped
            for critical care, diagnostics, and overnight monitoring. These facilities handle trauma,
            poisoning, respiratory distress, and post-surgical complications outside regular clinic hours.
            Use the Emergency Vets filter to find the nearest open facility.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Dog Grooming & Boarding in {city}</h3>
          <p>
            {city} has a wide range of professional pet grooming salons offering bathing, haircuts, nail
            trims, ear cleaning, and full-service spa treatments for dogs and cats. For overnight stays,
            pet boarding kennels and cage-free facilities in {city} provide supervised care, playtime, and
            feeding schedules. Dog daycare centers are also available for working pet owners who need
            daytime supervision and socialization.
          </p>
        </div>

        <p className="text-xs text-gray-400">
          PetOS Directory · {city}, {state} · Data sourced from Google Places and updated regularly.
          All listings are independently operated businesses. PetOS Directory does not endorse any
          specific provider.
        </p>
      </div>
    </section>
  )
}
