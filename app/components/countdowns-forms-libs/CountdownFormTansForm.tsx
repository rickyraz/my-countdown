import { Countdown, CountdownInput, countdownSchema, } from '~/server/functions/countdown';
import { formatDateForInput } from '~/utils/temporal'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-adapter'

interface CountdownFormProps {
  countdown?: Countdown
  onSubmit: (data: CountdownInput) => Promise<void>
  onCancel?: () => void
}

// <z.input<typeof countdownSchema>, ZodValidator>

export function CountdownForm({ countdown, onSubmit, onCancel }: CountdownFormProps) {
  const form = useForm({
    defaultValues: {
      title: countdown?.title || '',
      description: countdown?.description || undefined,
      targetDate: countdown ? formatDateForInput(countdown.targetDate) : formatDateForInput(),
    },
    onSubmit: ({ value }) => onSubmit(value),
    validators: {
      onChange: countdownSchema,
    },
    validatorAdapter: zodValidator,
  })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await form.handleSubmit()
      }}
      className="space-y-6"
    >
      <form.Field name="title">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Countdown title"
              className={field.state.meta.errors.length ? 'border-red-500' : ''}
            />
            {field.state.meta.errors.length > 0 && (
              <span className="text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div>
            <textarea
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value || undefined)}
              onBlur={field.handleBlur}
              placeholder="Description (optional)"
            />
            {field.state.meta.errors.length > 0 && (
              <span className="text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="targetDate">
        {(field) => (
          <div>
            <input
              type="datetime-local"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={field.state.meta.errors.length ? 'border-red-500' : ''}
            />
            {field.state.meta.errors.length > 0 && (
              <span className="text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      </form.Field>

      <button type="submit" disabled={form.state.isSubmitting}>
        {form.state.isSubmitting ? 'Saving...' : 'Save'}
      </button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  )
}

// import { zodValidator } from '@tanstack/zod-adapter'




// export function CountdownForm({ countdown, onSubmit, onCancel }: CountdownFormProps) {
//   const form = useForm({
//     defaultValues: {
//       title: countdown?.title || '',
//       description: countdown?.description || undefined,
//       targetDate: countdown ? formatDateForInput(countdown.targetDate) : formatDateForInput(),
//     },
//     onSubmit: ({ value }) => onSubmit(value),
//     validators: {
//       onChange: countdownSchema,
//       // onChange: zodValidator(countdownSchema),
//     },
//   })

//   return (
//     <form
//       onSubmit={async (e) => {
//         e.preventDefault()
//         await form.handleSubmit()
//       }}
//       className="space-y-6"
//     >
//       <form.Field name="title">
//         {(field) => (
//           <div>
//             <input
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//               onBlur={field.handleBlur}
//               placeholder="Countdown title"
//               className={field.state.meta.errors.length ? 'border-red-500' : ''}
//             />
//             {field.state.meta.errors.length > 0 && (
//               <span className="text-red-500">{field.state.meta.errors[0]}</span>
//             )}
//           </div>
//         )}
//       </form.Field>

//       <form.Field name="description">
//         {(field) => (
//           <div>
//             <textarea
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//               onBlur={field.handleBlur}
//               placeholder="Description (optional)"
//             />
//             {field.state.meta.errors.length > 0 && (
//               <span className="text-red-500">{field.state.meta.errors[0]}</span>
//             )}
//           </div>
//         )}
//       </form.Field>

//       <form.Field name="targetDate">
//         {(field) => (
//           <div>
//             <input
//               type="datetime-local"
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//               onBlur={field.handleBlur}
//               className={field.state.meta.errors.length ? 'border-red-500' : ''}
//             />
//             {field.state.meta.errors.length > 0 && (
//               <span className="text-red-500">{field.state.meta.errors[0]}</span>
//             )}
//           </div>
//         )}
//       </form.Field>

//       <button type="submit" disabled={form.state.isSubmitting}>
//         {form.state.isSubmitting ? 'Saving...' : 'Save'}
//       </button>
//       <button type="button" onClick={onCancel}>Cancel</button>
//     </form>
//   )
// }

