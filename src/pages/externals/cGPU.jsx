import { Helmet } from 'react-helmet-async';

import { CGPUView } from 'src/sections/cGPU/view';

// ----------------------------------------------------------------------

export default function CGPUPage() {
  return (
    <>
      <Helmet>
        <title> Predictram-cGPU </title>
      </Helmet>

      <CGPUView />
    </>
  );
}