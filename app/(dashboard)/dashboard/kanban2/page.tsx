import BreadCrumb from '@/components/breadcrumb';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import NewTaskDialog from '@/components/kanban/new-task-dialog';
import Kanban2Main from '@/components/kanban2/Kanban2Main';
import { Heading } from '@/components/ui/heading';

const breadcrumbItems = [{ title: 'Kanban2', link: '/dashboard/kanban2' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Kanban2`} description="Manage tasks by dnd" />
          
        </div>
        <Kanban2Main/>
      </div>
    </>
  );
}
