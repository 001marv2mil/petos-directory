export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.'']/g, '')   // Remove periods, apostrophes
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function generateSlug(
  stateSlug: string,
  citySlug: string,
  category: string,
  businessName: string,
): string {
  const parts = [
    slugify(stateSlug),
    slugify(citySlug),
    slugify(category),
    slugify(businessName),
  ]
  return parts.join('-')
}

// Deduplicating slug generator — tracks used slugs and appends -2, -3 on collision
export class SlugRegistry {
  private used = new Set<string>()

  generate(stateSlug: string, citySlug: string, category: string, businessName: string): string {
    const base = generateSlug(stateSlug, citySlug, category, businessName)
    if (!this.used.has(base)) {
      this.used.add(base)
      return base
    }
    let n = 2
    while (this.used.has(`${base}-${n}`)) n++
    const slug = `${base}-${n}`
    this.used.add(slug)
    return slug
  }
}
