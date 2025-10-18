import { createFileRoute, } from '@tanstack/react-router'
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { CountdownInput, createCountdown, deleteCountdown, getCountdowns } from '~/server/functions/countdown';
import { useEffect, useRef, useState, } from 'react';
import { CountdownCard } from '~/components/CountdownCard';
import { CountdownFormTansForm } from '~/components/countdowns-forms-libs/CountdownFormTansForm';

export const countdownsQueryOptions = () =>
  queryOptions({
    queryKey: ["countdowns"],
    queryFn: () => getCountdowns(),
    staleTime: 1000 * 60 * 5,
  });

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(countdownsQueryOptions()),
})

function HomePage() {
  const queryClient = useQueryClient()
  const { data: countdownsList } = useSuspenseQuery(countdownsQueryOptions());
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => setIsDialogOpen(false)
    dialog.addEventListener('close', handleClose)

    return () => dialog.removeEventListener('close', handleClose)
  }, [])


  const handleDelete = async (id: string) => {
    await deleteCountdown({ data: { id } })
    queryClient.invalidateQueries({ queryKey: ["countdowns"] })
  }

  const handleSubmit = async (data: CountdownInput) => {
    try {
      await createCountdown({ data })
      await queryClient.invalidateQueries({ queryKey: ["countdowns"] })
      dialogRef.current?.close()
    } catch (error) {
      console.error(error)
      throw error // PENTING: re-throw error agar form tahu ada error
    }
  }

  // Update state saat buka/tutup
  const openDialog = () => {
    dialogRef.current?.showModal()
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    dialogRef.current?.close()
    setIsDialogOpen(false)
  }



  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-cyan-900 mb-3 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text ">
          My Countdowns
        </h1>
        <p className="text-gray-600 text-lg">Track your important dates with precision</p>
      </header>
      <div className='flex justify-end mb-4'>
      <button type='button' className='cursor-pointer bg-cyan-800 hover:bg-cyan-900 text-white px-2.5 py-2 rounded' onClick={openDialog}>Add Countdown</button>
      </div>

      <dialog
        ref={dialogRef}
        // className="dialog-animated backdrop:bg-gray-50/15 mx-auto mt-44"
        className="dialog-animated backdrop:bg-gray-100/15 mx-auto my-auto w-sm"
        aria-labelledby="form-title"
        closedby='any'
      >
        <div className="p-6 bg-gray-50 border-2 rounded-xl border-cyan-900">
          <h2 id="form-title" className="sr-only">Create Countdown</h2>
          <CountdownFormTansForm
            onSubmit={handleSubmit}
            onCancel={closeDialog}
          />
        </div>
      </dialog>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${isDialogOpen ? "opacity-35" : "opacity-100"}`}>
        {countdownsList.map((countdown) => (
          <CountdownCard
            key={countdown._id}
            countdown={countdown}
            onEdit={() => { }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}