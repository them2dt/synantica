import { Event } from '@/types/event'

function formatICSDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

function formatICSDateExclusive(dateString: string): string {
  const date = new Date(dateString)
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

function escapeICS(str: string): string {
  return str.replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n')
}

function generateICS(event: Event): string {
  const uid = `${event.id}@synantica.ch`
  const now = new Date().toISOString().replace(/[-:]/g, '').replace('.', '').slice(0, 15) + 'Z'

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Synantica//STEM Directory//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${formatICSDate(event.fromDate)}`,
    `DTEND;VALUE=DATE:${formatICSDateExclusive(event.toDate)}`,
    `SUMMARY:${escapeICS(event.name)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    `LOCATION:${escapeICS([event.location, event.country].filter(Boolean).join(', '))}`,
    `ORGANIZER;CN="${escapeICS(event.organizer)}":mailto:noreply@synantica.ch`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadICS(event: Event): void {
  const blob = new Blob([generateICS(event)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
