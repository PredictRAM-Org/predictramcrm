import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '',
    icon: icon('ic_dashboard'),
  },
  {
    title: 'user',
    path: 'user',
    icon: icon('ic_user'),
  },
  {
    title: 'organization',
    path: 'organization',
    icon: icon('ic_org'),
  },
  {
    title: 'market call',
    path: 'market-call',
    icon: icon('ic_market'),
  },
  // {
  //   title: 'Responses',
  //   path: 'responses',
  //   icon: icon('ic_response'),
  // },
  {
    title: 'Manage Task',
    path: 'task',
    icon: icon('ic_notes'),
  },
  {
    title: 'Task',
    path: 'analyst-task',
    icon: icon('ic_notes'),
  },
  // {
  //   title: 'HedgeOS',
  //   path: 'hedgeOS',
  //   icon: icon('ic_rupee'),
  // },
  // {
  //   title: 'Predictram-cGPU',
  //   path: 'cGPU',
  //   icon: icon('ic_robot'),
  // },
];

export default navConfig;
