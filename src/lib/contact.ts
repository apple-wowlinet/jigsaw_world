export const CONTACT_EMAIL = 'support@jigsawworld.co'

export function parseContactInput(input: unknown) {
  if (!input || typeof input !== 'object') throw new Error('Please complete all fields.')
  const data = input as Record<string, unknown>
  const name = typeof data.name === 'string' ? data.name.trim() : ''
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
  const message = typeof data.message === 'string' ? data.message.trim() : ''
  const id = typeof data.id === 'string' ? data.id : ''
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error('Please refresh the page and try again.')
  }
  if (!name || name.length > 100) throw new Error('Please enter a name of up to 100 characters.')
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  if (!message || message.length > 5000) throw new Error('Please enter a message of up to 5,000 characters.')
  return { id, name, email, message }
}
