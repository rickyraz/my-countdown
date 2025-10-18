import { CountdownFormProps, countdownSchema } from '~/server/functions/countdown';
import { formatDateForInput } from '~/utils/temporal'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

export function CountdownFormFormik({ countdown, onSubmit, onCancel }: CountdownFormProps) {
  const formik = useFormik({
    initialValues: {
      title: countdown?.title || '',
      description: countdown?.description || '',
      targetDate: countdown ? formatDateForInput(countdown.targetDate) : formatDateForInput(),
    },
    validationSchema: toFormikValidationSchema(countdownSchema),
    onSubmit,
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <input
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Countdown title"
          className={formik.touched.title && formik.errors.title ? 'border-red-500' : ''}
        />
        {formik.touched.title && formik.errors.title && (
          <span className="text-red-500">{formik.errors.title}</span>
        )}
      </div>

      <div>
        <textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Description (optional)"
        />
        {formik.touched.description && formik.errors.description && (
          <span className="text-red-500">{formik.errors.description}</span>
        )}
      </div>

      <div>
        <input
          type="datetime-local"
          name="targetDate"
          value={formik.values.targetDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.targetDate && formik.errors.targetDate ? 'border-red-500' : ''}
        />
        {formik.touched.targetDate && formik.errors.targetDate && (
          <span className="text-red-500">{formik.errors.targetDate}</span>
        )}
      </div>

      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Saving...' : 'Save'}
      </button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  )
}

