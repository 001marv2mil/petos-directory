import { PageMeta } from '@/components/common/PageMeta'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageMeta
        title="Privacy Policy — PetOS Directory"
        description="PetOS Directory privacy policy. Learn how we collect, use, and protect your personal information."
        path="/privacy"
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 21, 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            PetOS Directory (<strong>petosdirectory.com</strong>) is a pet care discovery platform
            operated by PetOS Health. We help pet owners find local veterinarians, groomers,
            boarding facilities, and other pet care providers. Our parent company and data
            controller is PetOS Health (<strong>petoshealth.com</strong>).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Information you provide</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Email address (when you create an account or sign up for alerts)</li>
                <li>Password (hashed and never stored in plain text)</li>
                <li>Any information you voluntarily submit through forms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Information collected automatically</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Pages visited and search queries on our site</li>
                <li>IP address and approximate location</li>
                <li>Browser type, device type, and operating system</li>
                <li>Referring URLs and exit pages</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Favorites and saved providers</h3>
              <p className="text-gray-600">
                When you save a provider to your favorites, we store the association between your
                account and that provider in our database.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To create and manage your account</li>
            <li>To send you city and category alerts you subscribe to</li>
            <li>To improve our directory listings and search results</li>
            <li>To send you updates about PetOS Directory and PetOS Health products and services</li>
            <li>To analyze usage patterns and improve site performance</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Email Communications</h2>
          <p className="text-gray-600 leading-relaxed">
            By creating an account or signing up for alerts, you agree to receive emails from
            PetOS Directory and PetOS Health. These may include new listing notifications, product
            updates, and occasional promotional offers. You can unsubscribe at any time by clicking
            the unsubscribe link in any email or contacting us directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Sharing</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We do not sell your personal information. We may share your data with:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Supabase</strong> — our database and authentication provider (data stored in the US)</li>
            <li><strong>PetOS Health</strong> — our parent company, for product development and marketing purposes</li>
            <li><strong>Analytics providers</strong> — in aggregated, anonymized form only</li>
            <li><strong>Law enforcement</strong> — when required by applicable law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
          <p className="text-gray-600 leading-relaxed">
            We retain your account data for as long as your account is active. If you delete your
            account, we will remove your personal information within 30 days, except where we are
            required to retain it for legal or compliance purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Data portability (receive your data in a structured format)</li>
          </ul>
          <p className="text-gray-600 mt-3">
            To exercise these rights, email us at <strong>privacy@petoshealth.com</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            We use essential cookies to keep you signed in and remember your preferences. We may
            also use analytics cookies to understand how visitors use our site. By continuing to use
            PetOS Directory, you consent to our use of cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            PetOS Directory is not directed to children under 13. We do not knowingly collect
            personal information from children. If you believe a child has provided us with their
            information, please contact us and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this privacy policy from time to time. We will notify registered users
            of material changes by email. Continued use of PetOS Directory after changes take
            effect constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            Questions about this privacy policy or how we handle your data?
          </p>
          <address className="not-italic mt-2 text-gray-600 space-y-1">
            <p><strong>PetOS Health</strong></p>
            <p>Email: <a href="mailto:privacy@petoshealth.com" className="text-green-600 hover:text-green-700">privacy@petoshealth.com</a></p>
            <p>Website: <a href="https://petoshealth.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">petoshealth.com</a></p>
          </address>
        </section>

      </div>
    </div>
  )
}
