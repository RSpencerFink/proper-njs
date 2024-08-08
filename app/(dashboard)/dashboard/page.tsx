
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [{ title: 'Dashboard', link: '/dashboard' }];

export default function page() {
  return (
    <ScrollArea className="h-full">
       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Dashboard`} description="Good place to start" />
          Dashboard
          
        </div>
        Dashboard
        
      </div>
    </ScrollArea>
  );
}
