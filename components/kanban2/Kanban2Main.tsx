import Columns from '@/components/kanban2/columns';
import { Fragment } from 'react';

export default function Kanban2Main() {
  return (
    <Fragment>
      <section className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 py-12 dark:text-white text-black overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-6">
          <Columns />
        </div>
      </section>
    </Fragment>
  );
}
