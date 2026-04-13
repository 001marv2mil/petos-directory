type EventType = 'view' | 'click_phone' | 'click_website' | 'click_directions'

export function trackEvent(providerId: string, eventType: EventType) {
  const body = JSON.stringify({ provider_id: providerId, event_type: eventType })

  // Use sendBeacon for non-blocking fire-and-forget tracking
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
  } else {
    fetch('/api/track', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
  }
}
