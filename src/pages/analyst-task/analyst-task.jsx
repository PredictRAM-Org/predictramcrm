import { Helmet } from 'react-helmet-async';
import { AnalystTaskView } from 'src/sections/analyst-task/view';

// ----------------------------------------------------------------------

export default function AnalystTaskPage() {
  return (
    <>
      <Helmet>
        <title> Analyst Task </title>
      </Helmet>

      <AnalystTaskView />
    </>
  );
}
