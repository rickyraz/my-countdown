import { useState } from 'react'
import { CountdownFormProps } from '~/server/functions/countdown'
import { formatDateForInput } from '~/utils/temporal'

export function CountdownForm({ countdown, onSubmit, onCancel }: CountdownFormProps) {
  const [title, setTitle] = useState(countdown?.title || '')
  const [description, setDescription] = useState(countdown?.description || '')
  const [targetDate, setTargetDate] = useState(
    countdown ? formatDateForInput(countdown.targetDate) : formatDateForInput()
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!targetDate) {
      setError('Target date is required')
      return
    }

    // Validate date is in the future (for new countdowns)
    const selectedDate = new Date(targetDate)
    if (!countdown && selectedDate < new Date()) {
      setError('Target date must be in the future')
      return
    }

    setIsSubmitting(true)
    try {
      // Convert local datetime to ISO string
      const isoDate = new Date(targetDate).toISOString()
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        targetDate: isoDate,
      })

      onCancel?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save countdown')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          placeholder="Enter countdown title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Add a description (optional)"
        />
      </div>

      <div>
        <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
          Target Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          id="targetDate"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          required
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary-600 text-cyan-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : countdown ? 'Update Countdown' : 'Create Countdown'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
