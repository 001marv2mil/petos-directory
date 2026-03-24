interface ProviderMapProps {
  address: string
  name: string
}

export function ProviderMap({ address, name }: ProviderMapProps) {
  const query = encodeURIComponent(`${address}`)
  const src = `https://maps.google.com/maps?q=${query}&output=embed&z=15`

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <iframe
        src={src}
        width="100%"
        height="280"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing location of ${name}`}
        className="block"
      />
    </div>
  )
}
