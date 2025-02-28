import { Helmet } from 'react-helmet-async';

import { TaskForm } from 'src/sections/task/form';

// ----------------------------------------------------------------------

export default function TaskFormPage() {
  return (
    <>
      <Helmet>
        <title> Task Form </title>
      </Helmet>

      <TaskForm />
    </>
  );
}
