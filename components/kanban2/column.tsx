'use client'

import { Status, Task as TaskType, useTodoStore } from '@/lib/todoStore'
import Task from './task'
import { useEffect, useMemo } from 'react'
import { useToast } from '../ui/use-toast'
import { createClient } from '@/utils/supabase/client';
import { useUserStore } from '@/lib/userStore'

export default function Column({
  title,
  status
}: {
  title: string
  status: Status
}) {
  const tasks = useTodoStore(state => state.tasks)
  const filteredTasks = useMemo(
    () => tasks ? tasks.filter(task => task.status === status) : null,
    [tasks, status]
  )
  const supabase = createClient();

  const updateStatus = useTodoStore(state => state.updateStatus)
  const dragTask = useTodoStore(state => state.dragTask)
  const updateIsLoadingTasks = useTodoStore(state => state.updateIsLoadingTasks)
  const addCurrentUser = useUserStore(state => state.addUser)

  const draggedTask = useTodoStore(state => state.draggedTask)
  const { toast } = useToast()

  useEffect(() => {
    if (status === "TODO") {
      getTodos().then(({todos, user}) => {
        const storedTodos = todos as TaskType[]     

        addCurrentUser(user)

        useTodoStore.setState({ tasks: [] })
        useTodoStore.setState({ tasks: storedTodos })
        updateIsLoadingTasks(false)
      })
    }
  }, [])






	useEffect(() => {		
		const channel = supabase
			.channel("chat-room")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "todos" },
				async (payload: any) => {

          console.log("Insert PubSub ", payload)

          // TODO: save to context

					// if (!optimisticIds.includes(payload.new.id)) {
					// 	const {
					// 		data: { user }, error
					// 	} = await supabase.auth.getUser()

					// 	if (error) {
					// 		toast.error(error.message);
					// 	} else {
					// 		const newMessage = {
					// 			...payload.new,
					// 			users: user,
					// 		};
					// 		addMessage(newMessage as any);
					// 	}
					// }
					// const scrollContainer = scrollRef.current;
					// if (
					// 	scrollContainer.scrollTop <
					// 	scrollContainer.scrollHeight -
					// 	scrollContainer.clientHeight -
					// 	10
					// ) {
					// 	setNotification((current) => current + 1);
					// }
				}
			)
			.on(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "todos" },
				(payload: any) => {

          console.log("Delete PubSub ", payload)

          //TODO: take care of deleted messages in context

					// optimisticDeleteMessage(payload.old.id);
				}
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "todos" },
				(payload: any) => {
          console.log("Update PubSub ", payload)
					// optimisticUpdateMessage(payload.new as Imessage);
          //TODO: take care of updated messages broadcasted to all user in context
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, [useTodoStore.getState().tasks.length]);






  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggedTask) return
    updateStatus(draggedTask, status)
    dragTask(null)

    const updateTaskInDatabase = async () => {      

      const { data, error } = await supabase
        .from('todos')
        .update({ status: status })
        .eq('id', draggedTask)
        .select()

      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating todo in database: " + error.message
        })

        return
      }

      return data
    }

    updateTaskInDatabase().then((data) => {
      if (data) {
        toast({
          title: "Success updating STATUS to " + status + " in the database."
        })
      }
    })
  }

  const getTodos = async () => {

    const { data: { user } } = await supabase.auth.getUser()

    let { data: todos, error } = await supabase
      .from('todos')
      .select('id, description, status, title')
      .eq('user_id', user?.id)

    if (error) {
      toast({
        variant: "destructive",
        title: error.message === 'invalid input syntax for type uuid: "undefined"' ? "PLEASE LOGIN to save todos specific to you" : "Error getting todos from database: " + error.message
      })
    }

    return {todos, user}
  }

  return (
    <section className='h-[600px] flex-1'>
      <h2 className='ml-1 font-serif text-2xl font-semibold'>{title}</h2>

      <div
        className='mt-3.5 min-h-max  w-full rounded-xl bg-gray-700/50 p-4 '
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <div className='flex flex-col gap-4 min-h-max'>

          {filteredTasks?.map(task => (
            <Task key={task.id} {...task} />
          ))}

          {filteredTasks?.length === 0 && status === 'TODO' && (
            <div className='mt-8 text-center text-sm text-black dark:text-white'>
              <p>Create a new task</p>
            </div>
          )}

          <div className='mt-8 text-center text-sm text-black dark:text-white'>
            <p>Drag your tasks here</p>
          </div>

        </div>
      </div>
    </section>
  )
}
