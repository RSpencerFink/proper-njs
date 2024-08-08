'use client'

import { Status, useTodoStore } from '@/lib/todoStore'
import { cn } from '@/lib/utils'
import { Fragment } from 'react'
import { useToast } from '../ui/use-toast'
import { createClient } from '@/utils/supabase/client';
import { useUserStore } from '@/lib/userStore'

export default function Task({
  id,
  title,
  description,
  status,
  isEditing
}: {
  id: string
  title: string
  description?: string
  status: Status
  isEditing?: boolean
}) {
  const dragTask = useTodoStore(state => state.dragTask)
  const removeTask = useTodoStore(state => state.removeTask)
  const isEditTask = useTodoStore(state => state.isEditTask)
  const updateTitleText = useTodoStore(state => state.updateTitleText)
  const updateDescriptionText = useTodoStore(
    state => state.updateDescriptionText
  )
  const supabase = createClient();
  const { toast } = useToast()

  const updateTaskInDatabase = async () => {

    if (isEditing) {
      const { data, error } = await supabase
        .from('todos')
        .update({ title: title, description: description })
        .eq('id', id)
        .select()

      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating todo in database: " + error.message
        })
      }

      toast({
        title: "Success updating todo!"
      })
    }
    isEditTask(id)

  }

  const deleteTaskFromDatabase = async () => {

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating todo in database: " + error.message
      })
    }

    toast({
      title: "Success deleting todo!"
    })
  }

  return (
    <div
      className={cn('rounded-lg bg-white px-3 py-2 text-gray-900 min-w-max', {
        'border-2 border-green-600': status === 'TODO',
        'border-2 border-amber-500': status === 'IN_PROGRESS',
        'border-2 border-rose-600': status === 'DONE'
      })}
      onDragStart={() => dragTask(id)}
      draggable
    >
      <div>
        {useTodoStore.getState().isLoadingTasks ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
        ) : (
          <div>

            <h3
              className={`font-medium text-gray-700 ${status === 'DONE' ? `line-through` : null}`}
            >
              {isEditing ? (
                <div className='float-left flex flex-col'>
                  <input
                    type='text'
                    className='max-w-60 rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                    value={title}
                    onChange={e => updateTitleText(id, e.target.value)}
                  />
                  {description !== '' ? (
                    <input
                      type='text'
                      className='max-w-60 rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                      value={description}
                      onChange={e => updateDescriptionText(id, e.target.value)}
                    />
                  ) : null}
                </div>
              ) : (
                title
              )}
              <div className='relateve float-right mt-1'>
                <div className='flex '>
                  {isEditing ? (
                    <button
                      onClick={updateTaskInDatabase}
                      type='button'
                      className='space-between bottom-6 mx-3 flex rounded-lg bg-blue-700 px-2 py-1 text-center text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                    >
                      Enter
                    </button>
                  ) : (
                    <Fragment>
                      {status !== 'DONE' ? (
                        <button
                          className=' space-between mx-3 flex cursor-pointer'
                          onClick={() => isEditTask(id)}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            className='h-5 w-5 text-gray-500 hover:text-rose-400'
                            viewBox='0 0 30 30'
                          >
                            <path d='M24,11l2.414-2.414c0.781-0.781,0.781-2.047,0-2.828l-2.172-2.172c-0.781-0.781-2.047-0.781-2.828,0L19,6L24,11z M17,8	L5.26,19.74c0,0,0.918-0.082,1.26,0.26c0.342,0.342,0.06,2.58,0.48,3s2.644,0.124,2.963,0.443c0.319,0.319,0.297,1.297,0.297,1.297	L22,13L17,8z M4.328,26.944l-0.015-0.007C4.213,26.97,4.111,27,4,27c-0.552,0-1-0.448-1-1c0-0.111,0.03-0.213,0.063-0.313	l-0.007-0.015L4,23l1.5,1.5L7,26L4.328,26.944z'></path>
                          </svg>
                        </button>
                      ) : null}
                    </Fragment>
                  )}

                  <button
                    className='cursor-pointer'
                    onClick={() => {
                      removeTask(id)
                      deleteTaskFromDatabase()
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='h-5 w-5 text-gray-500 hover:text-rose-400'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </h3>
          </div>

        )}

        <div>
          {!isEditing && description !== '' && (
            <p className={`mt-2 text-sm font-light text-gray-500 ${status === 'DONE' ? `line-through` : null}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
