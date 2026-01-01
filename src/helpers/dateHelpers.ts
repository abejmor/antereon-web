export const formatTableDate = (
  isoDate: string | Date,
  locale: string = 'en-US'
): string => {
  try {
    const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate

    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }

    return new Intl.DateTimeFormat(locale, {
      year:   'numeric',
      month:  '2-digit',
      day:    '2-digit',
      hour:   '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

export const formatDate = (
  isoDate: string | Date | null,
  locale: string = 'en-US',
  timeZone?: string
): string => {
  try {
    if (isoDate === null || isoDate === undefined) {
      return 'Invalid Date'
    }

    const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate

    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }

    const options: Intl.DateTimeFormatOptions = {
      year:   'numeric',
      month:  'short',
      day:    'numeric',
      hour:   '2-digit',
      minute: '2-digit'
    }

    if (timeZone) {
      options.timeZone = timeZone
    }

    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

export const formatDateWithTimezone = (
  isoDate: string | Date,
  locale: string = 'en-US',
  showTimezone: boolean = true
): string => {
  try {
    const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate

    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }

    const formattedDate = new Intl.DateTimeFormat(locale, {
      year:   'numeric',
      month:  'short',
      day:    'numeric',
      hour:   '2-digit',
      minute: '2-digit'
    }).format(date)

    if (!showTimezone) {
      return formattedDate
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timeZoneShort = new Intl.DateTimeFormat(locale, {
      timeZoneName: 'short'
    }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || timeZone

    return `${formattedDate} (${timeZoneShort})`
  } catch (error) {
    console.error('Error formatting date with timezone:', error)
    return 'Invalid Date'
  }
}

export const formatDateOnly = (
  isoDate: string | Date,
  locale: string = 'en-US'
): string => {
  try {
    const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate

    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }

    return new Intl.DateTimeFormat(locale, {
      year:  'numeric',
      month: 'short',
      day:   'numeric'
    }).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

export const getUserInitials = (
  name: string,
  maxInitials: number = 2
): string => {
  if (!name || typeof name !== 'string') {
    return ''
  }

  return name
    .trim()
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, maxInitials)
}
