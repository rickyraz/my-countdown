import { CountdownFormProps, countdownSchema, } from '~/server/functions/countdown';
import { formatDateForInput } from '~/utils/temporal'
import { useForm } from '@tanstack/react-form'

export function CountdownFormTansForm({ countdown, onSubmit, onCancel }: CountdownFormProps) {
  const form = useForm({
    defaultValues: {
      title: countdown?.title || '',
      description: countdown?.description || undefined,
      targetDate: countdown ? formatDateForInput(countdown.targetDate) : formatDateForInput(),
    },
    validators: {
      onChange: countdownSchema,
    },
    // onSubmit: ({ value }) => onSubmit(value),
    onSubmit: async ({ value }) => {
      console.log('Form submitting...')
      await onSubmit(value)
      console.log('Form done')
      form.reset() // ✅ Reset form setelah submit
    },
  })

  console.log("form.state.isSubmitting", form.state.isSubmitting)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <form.Field name="title">
        {(field) => (
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Countdown title"
              className={`${field.state.meta.errors.length ? 'border-red-500' : ''} w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <span className="text-red-500">{field.state.meta.errors.map(err => err?.message).join(', ')}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
              placeholder="Description (optional)"
              className={`${field.state.meta.errors.length ? 'border-red-500' : ''} w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none`}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <span className="text-red-500">{field.state.meta.errors.map(err => err?.message).join(', ')}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="targetDate">
        {(field) => (
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
              Target Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="targetDate"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={`${field.state.meta.errors.length ? 'border-red-500' : ''} w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <span className="text-red-500">{field.state.meta.errors.map(err => err?.message).join(', ')}</span>
            )}
          </div>
        )}
      </form.Field>

      <div className='flex gap-3'>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit || isSubmitting} className="flex-1 bg-primary-600 text-cyan-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          )}
        </form.Subscribe>
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </form>
  )
}