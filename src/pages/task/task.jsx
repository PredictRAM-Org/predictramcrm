import { Helmet } from 'react-helmet-async';

import { TaskView } from 'src/sections/task/view';

// ----------------------------------------------------------------------

export default function TaskPage() {
  return (
    <>
      <Helmet>
        <title> Manage Task </title>
      </Helmet>

      <TaskView />
    </>
  );
}
