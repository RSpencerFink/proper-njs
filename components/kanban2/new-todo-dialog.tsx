'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useTodoStore } from '@/lib/todoStore'
import { useToast } from '../ui/use-toast'
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from '@/lib/userStore'

export default function NewTodoDialog() {
  const addTask = useTodoStore(state => state.addTask)
  const { toast } = useToast()
  const supabase = createClient();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const createdId = uuidv4();

    const form = e.currentTarget
    const formData = new FormData(form)
    const { title, description } = Object.fromEntries(formData)

    if (typeof title !== 'string' || typeof description !== 'string') return

    addTask(createdId, title, description)

    const addTodo = async () => {      

      const { data, error } = await supabase.from("todos").insert({
        id: createdId,
        title: title,
        description: description,
        user_id: useUserStore.getState().user?.id
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error adding todo to database: " + error.message
        })
      }

      return data
    }

    addTodo().then((result) => {
      toast({
        title: "Success storing todo!"
      })
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'>
          ＋ Add New Todo
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
          <DialogDescription>
            What do you want to get done today?
          </DialogDescription>
        </DialogHeader>
        <form
          id='todo-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='title'
              name='title'
              placeholder='Todo title...'
              className='col-span-4'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Textarea
              id='description'
              name='description'
              placeholder='Description...'
              className='col-span-4'
            />
          </div>
        </form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type='submit' size='sm' form='todo-form'>
              Add Todo
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
