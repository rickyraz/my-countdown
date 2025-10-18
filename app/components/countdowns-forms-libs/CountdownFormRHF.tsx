import { CountdownFormProps, countdownSchema } from '~/server/functions/countdown';
import { formatDateForInput } from '~/utils/temporal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function CountdownFormRHF({ countdown, onSubmit, onCancel }: CountdownFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(countdownSchema),
    defaultValues: {
      title: countdown?.title || '',
      description: countdown?.description || '',
      targetDate: countdown ? formatDateForInput(countdown.targetDate) : formatDateForInput(),
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <input
          {...register('title')}
          placeholder="Countdown title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <span className="text-red-500">{errors.title.message}</span>}
      </div>

      <div>
        <textarea
          {...register('description')}
          placeholder="Description (optional)"
        />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}
      </div>

      <div>
        <input
          type="datetime-local"
          {...register('targetDate')}
          className={errors.targetDate ? 'border-red-500' : ''}
        />
        {errors.targetDate && <span className="text-red-500">{errors.targetDate.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  )
}

