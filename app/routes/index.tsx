import { createFileRoute, } from '@tanstack/react-router'
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createCountdown, deleteCountdown, getCountdowns } from '~/server/functions/countdown';
import { useRef, useState } from 'react';
import { CountdownForm } from '~/components/countdowns-forms-libs/CountdownFormState';
import { CountdownCard } from '~/components/CountdownCard';


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
  const { data: countdownsList } = useSuspenseQuery(countdownsQueryOptions());
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient()

  const handleDelete = async (id: string) => {
    await deleteCountdown({ data: { id } })
    queryClient.invalidateQueries({ queryKey: ["countdowns"] })
  }

  const handleSubmit = async (data: { title: string; description?: string; targetDate: string }) => {
    await createCountdown({ data })
    queryClient.invalidateQueries({ queryKey: ["countdowns"] })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-cyan-900 mb-3 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text ">
          My Countdowns
        </h1>
        <p className="text-gray-600 text-lg">Track your important dates with precision</p>
      </header>

      <button onClick={() => dialogRef.current?.showModal()}>Show Form</button>

      <dialog ref={dialogRef} className=" backdrop:bg-gray-50/15 mx-auto mt-44" aria-labelledby="form-title" closedby="any">
        <div className="p-6 bg-gray-50 border-2 rounded-lg border-cyan-900">
          <h2 id="form-title" className="sr-only">Create Countdown</h2>
          <CountdownForm
            onSubmit={handleSubmit}
            onCancel={() => dialogRef.current?.close()}
          />
        </div>
      </dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countdownsList.map((countdown) => (
          <CountdownCard
            key={countdown._id}
            countdown={{ ...countdown, _id: countdown._id }}
            onEdit={() => { }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}