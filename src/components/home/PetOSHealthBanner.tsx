export function PetOSHealthBanner() {
  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
        {/* Icon / brand mark */}
        <div className="shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-700 shadow-lg">
          <svg viewBox="0 0 40 40" fill="none" className="w-11 h-11" aria-hidden="true">
            <path d="M20 6C13.4 6 8 11.4 8 18c0 4.2 2.1 7.9 5.3 10.2L12 36l5-2.5c1 .3 2 .5 3 .5 6.6 0 12-5.4 12-12S26.6 6 20 6z" fill="white" opacity="0.2"/>
            <path d="M16 17a2 2 0 100-4 2 2 0 000 4zM24 17a2 2 0 100-4 2 2 0 000 4zM13 22s1.5 4 7 4 7-4 7-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Copy */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Trusted Partner</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Manage your pet's health with PetOS Health
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl">
            Track vet visits, store vaccination records, set medication reminders, and share health history with any provider — all in one place.
          </p>
        </div>

        {/* CTA */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <a
            href="https://petoshealth.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            Try PetOS Health
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <span className="text-xs text-gray-400">Free to get started</span>
        </div>
      </div>
    </section>
  )
}
