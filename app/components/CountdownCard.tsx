import { useState, useEffect } from 'react'
import { calculateTimeRemaining, formatDate, type TimeRemaining } from '~/utils/temporal'
import clsx from 'clsx'
import { Countdown } from '~/server/functions/countdown'

interface CountdownCardProps {
  countdown: Countdown
  onEdit: (countdown: Countdown) => void
  onDelete: (id: string) => void
  // onDelete: (data: { _id: Id<"countdowns"> }) => void
  // onDelete: (data: { id: string; }) => void
}

export function CountdownCard({ countdown, onEdit, onDelete }: CountdownCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(countdown.targetDate)
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(countdown.targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown.targetDate])

  const handleDelete = () => {
    onDelete(countdown._id)
    setShowDeleteConfirm(false)
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-2',
        timeRemaining.isExpired ? 'border-red-200 bg-red-50' : 'border-primary-200'
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{countdown.title}</h3>
          {countdown.description && (
            <p className="text-gray-600 text-sm">{countdown.description}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(countdown)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit countdown"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete countdown"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {timeRemaining.isExpired ? 'Expired on' : 'Countdown to'}: {formatDate(countdown.targetDate)}
        </p>
      </div>

      {timeRemaining.isExpired ? (
        <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-red-700">Time's Up!</p>
          <p className="text-sm text-red-600 mt-2">This countdown has expired</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 ">
          <TimeUnit value={timeRemaining.days} label="Days" />
          <TimeUnit value={timeRemaining.hours} label="Hours" />
          <TimeUnit value={timeRemaining.minutes} label="Minutes" />
          <TimeUnit value={timeRemaining.seconds} label="Seconds" />
        </div>
      )}

      {!timeRemaining.isExpired && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
            <div>
              <span className="font-semibold">{timeRemaining.totalHours.toLocaleString()}</span>
              <span className="ml-1">total hours</span>
            </div>
            <div>
              <span className="font-semibold">{timeRemaining.totalMinutes.toLocaleString()}</span>
              <span className="ml-1">total minutes</span>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Countdown?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{countdown.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-4 text-center text-cyan-700">
      <div className="text-3xl font-bold mb-1">{value.toString().padStart(2, '0')}</div>
      <div className="text-xs uppercase tracking-wide opacity-90">{label}</div>
    </div>
  )
}
