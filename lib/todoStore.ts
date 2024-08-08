import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Task = {
  id: string
  title: string
  description?: string
  isEditing?: boolean
  status: Status
}

export type State = {
  tasks: Task[]
  draggedTask: string | null
  isLoadingTasks: boolean
  currentIndexOfTodoEditing: number
}

export type Actions = {
  addTask: (id: string, title: string, description?: string) => void
  dragTask: (id: string | null) => void
  removeTask: (title: string) => void
  isEditTask: (id: string) => void
  updateIsLoadingTasks: (isLoading: boolean) => void
  updateStatus: (title: string, status: Status) => void
  updateTitleText: (id: string, title: string) => void
  updateDescriptionText: (id: string, description: string) => void
}

export const useTodoStore = create<State & Actions>()(set => ({
  tasks: [
    {
      id: "gsdfgsf",
      title: "",
      description: "",
      isEditing: false,
      status: "TODO"
    },
    {
      id: "yyuioyiy",
      title: "",
      description: "",
      isEditing: false,
      status: "TODO"
    },
    {
      id: "gsdfgsf",
      title: "",
      description: "",
      isEditing: false,
      status: "IN_PROGRESS"
    },
    {
      id: "yyuioyiy",
      title: "",
      description: "",
      isEditing: false,
      status: "IN_PROGRESS"
    },
    {
      id: "gsdfgsf",
      title: "",
      description: "",
      isEditing: false,
      status: "DONE"
    },
    {
      id: "yyuioyiy",
      title: "",
      description: "",
      isEditing: false,
      status: "DONE"
    }
  ],
  draggedTask: null,
  isLoadingTasks: true,
  currentIndexOfTodoEditing: 0,
  addTask: (id: string, title: string, description?: string) =>
    set(state => ({
      tasks: [
        ...state.tasks,
        { id: id, title, description, status: 'TODO', isEditing: false }
      ]

    })),
  dragTask: (id: string | null) => set({ draggedTask: id }),
  removeTask: (id: string) =>
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id)
    })),
  isEditTask: (id: string) =>
    set(state => {

      let index = state.tasks.map(function (e) {
        return e.id;
      }).indexOf(id);

      state.tasks[index].isEditing = !state.tasks[index].isEditing
      const todoListClone = structuredClone(state.tasks);

      return ({
        tasks: todoListClone,
        currentIndexOfTodoEditing: index
      })
    })
  ,
  updateIsLoadingTasks: (isLoading: boolean) =>
    set(state => ({
      isLoadingTasks: isLoading
    })),
  updateStatus: (id: string, status: Status) =>
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, status } : task
      )
    })),
  updateTitleText: (id: string, title: string) =>
    set(state => {

      state.tasks[state.currentIndexOfTodoEditing].title = title
      const todoListClone = structuredClone(state.tasks);

      return ({
        tasks: todoListClone
      })
    }),
  updateDescriptionText: (id: string, description: string) =>
    set(state => {

      state.tasks[state.currentIndexOfTodoEditing].description = description
      const todoListClone = structuredClone(state.tasks);

      return ({
        tasks: todoListClone
      })
    })
}))





