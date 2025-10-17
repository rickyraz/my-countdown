import 'temporal-polyfill/global'

export interface TimeRemaining {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  isExpired: boolean
}

export function calculateTimeRemaining(targetDateString: string): TimeRemaining {
  try {
    // Parse the target date
    const targetInstant = Temporal.Instant.from(targetDateString)
    const targetZonedDateTime = targetInstant.toZonedDateTimeISO(Temporal.Now.timeZoneId())

    // Get current time
    const nowZonedDateTime = Temporal.Now.zonedDateTimeISO()

    // Calculate if expired
    const isExpired = Temporal.ZonedDateTime.compare(nowZonedDateTime, targetZonedDateTime) >= 0

    // Calculate duration
    const duration = isExpired
      ? nowZonedDateTime.since(targetZonedDateTime)
      : targetZonedDateTime.since(nowZonedDateTime)

    // Convert to various units
    const totalSeconds = Math.abs(duration.total('seconds'))
    const totalMinutes = Math.abs(duration.total('minutes'))
    const totalHours = Math.abs(duration.total('hours'))
    const totalDays = Math.abs(duration.total('days'))
    const days = Math.floor(totalDays)
    const years = Math.floor(totalDays / 365)
    const months = Math.floor((totalDays % 365) / 30)
    const weeks = Math.floor(((totalDays % 365) % 30) / 7)
    
    // Calculate individual components
    // const years = Math.floor(totalDays / 365)
    // const remainingDaysAfterYears = totalDays % 365
    // const months = Math.floor(remainingDaysAfterYears / 30)
    // const remainingDaysAfterMonths = remainingDaysAfterYears % 30
    // const weeks = Math.floor(remainingDaysAfterMonths / 7)
    // const days = Math.floor(remainingDaysAfterMonths % 7)
    // const totalSecondsInDays = totalDays * 24 * 60 * 60
    // const remainingSeconds = totalSeconds - totalSecondsInDays
    // const hours = Math.floor(remainingSeconds / 3600)
    // const minutes = Math.floor((remainingSeconds % 3600) / 60)
    // const seconds = Math.floor(remainingSeconds % 60)

    const hours = Math.floor(totalHours % 24)
    const minutes = Math.floor(totalMinutes % 60)
    const seconds = Math.floor(totalSeconds % 60)

    return {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      totalDays: Math.floor(totalDays),
      totalHours: Math.floor(totalHours),
      totalMinutes: Math.floor(totalMinutes),
      totalSeconds: Math.floor(totalSeconds),
      isExpired,
    }
  } catch (error) {
    console.error('Error calculating time remaining:', error)
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0,
      isExpired: true,
    }
  }
}

export function formatDate(dateString: string): string {
  try {
    const instant = Temporal.Instant.from(dateString)
    const zonedDateTime = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId())

    return zonedDateTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch (error) {
    return dateString
  }
}

export function formatDateForInput(dateString?: string): string {
  if (!dateString) {
    const now = Temporal.Now.zonedDateTimeISO()
    return now.toPlainDateTime().toString().slice(0, 16)
  }

  try {
    const instant = Temporal.Instant.from(dateString)
    const zonedDateTime = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId())
    return zonedDateTime.toPlainDateTime().toString().slice(0, 16)
  } catch (error) {
    const now = Temporal.Now.zonedDateTimeISO()
    return now.toPlainDateTime().toString().slice(0, 16)
  }
}
