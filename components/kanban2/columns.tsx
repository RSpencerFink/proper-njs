import Column from './column'
import NewTodoDialog from './new-todo-dialog'

export default function Columns() {

  return (
    <div>
      <NewTodoDialog />

      <div >
        <h2 className='font-sans text-lg mt-6 underline-offset-2 underline'>Your Todo Groups</h2>
        <div className="flex flex-wrap justify-start gap-5 mt-2 ">
          <button className='flex flex-col px-3 py-1 outline-double outline-3 outline-offset-2 items-center rounded'>
            <div>
              The Moneypennies
            </div>
            <div className="flex -space-x-3 rtl:space-x-reverse max-w-52 flex-wrap place-content-center ">
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Kevin+Mock&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Joe+Taranova&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Lo+Kay&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=kevin@test.com=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Kevin+Mock&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Joe+Taranova&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Lo+Kay&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=kevin@test.com=true&background=random" alt="" />

            </div>
          </button>
          <button className='flex flex-col px-3 py-1 outline-double outline-3 outline-offset-2 items-center rounded'>
            <div>
              The Doers
            </div>
            <div className="flex -space-x-3 rtl:space-x-reverse max-w-52 flex-wrap place-content-center ">
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Kevin+Mock&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Joe+Taranova&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=Lo+Kay&rounded=true&background=random" alt="" />
              <img className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="https://ui-avatars.com/api/?name=kevin@test.com=true&background=random" alt="" />
           

            </div>
          </button>

        </div>
      </div>

      <section className='mt-10 flex gap-6 lg:gap-12 overflow-y-auto'>
        <Column title='Todo' status='TODO' />
        <Column title='In Progress' status='IN_PROGRESS' />
        <Column title='Done' status='DONE' />
      </section>

    </div>
  )
}
