import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const event = req.body

  // Handle checkout.session.completed — customer paid for featured listing
  if (event?.type === 'checkout.session.completed') {
    const session = event.data?.object
    const customerEmail = session?.customer_email || session?.customer_details?.email

    if (customerEmail) {
      // Find the provider by contact_email
      const { data: provider } = await supabase
        .from('providers')
        .select('id')
        .ilike('contact_email', customerEmail)
        .limit(1)
        .single()

      if (provider) {
        // Log the payment
        await supabase.from('featured_payments').insert({
          provider_id: provider.id,
          stripe_customer_id: session?.customer || null,
          stripe_subscription_id: session?.subscription || null,
          status: 'active',
        })

        // Mark the provider as featured so the UI shows the badge immediately
        await supabase
          .from('providers')
          .update({ featured: true })
          .eq('id', provider.id)

        console.log(`Featured activated for provider ${provider.id} (${customerEmail})`)
      } else {
        console.log(`Payment received but no provider found for email: ${customerEmail}`)
      }
    }
  }

  // Handle customer.subscription.deleted — customer cancelled
  if (event?.type === 'customer.subscription.deleted') {
    const subscription = event.data?.object
    const subscriptionId = subscription?.id

    if (subscriptionId) {
      // Mark the payment as cancelled
      await supabase
        .from('featured_payments')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscriptionId)

      // Un-feature the provider — look up provider_id from the payment record
      const { data: payment } = await supabase
        .from('featured_payments')
        .select('provider_id')
        .eq('stripe_subscription_id', subscriptionId)
        .single()

      if (payment) {
        // Only un-feature if no OTHER active payment exists for this provider
        const { count } = await supabase
          .from('featured_payments')
          .select('*', { count: 'exact', head: true })
          .eq('provider_id', payment.provider_id)
          .eq('status', 'active')

        if (!count || count === 0) {
          await supabase
            .from('providers')
            .update({ featured: false })
            .eq('id', payment.provider_id)
          console.log(`Featured removed for provider ${payment.provider_id}`)
        }
      }

      console.log(`Subscription cancelled: ${subscriptionId}`)
    }
  }

  return res.status(200).json({ received: true })
}
