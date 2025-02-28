import { ROLES } from 'src/enums';

export const roleBasedRoutes = {
  ADMIN: [
    'user',
    'task',
    'user/add',
    'market-call',
    'market-call/:type?/:marketState?/:view?',
    'market-call/details/:id/:response?',
    'cGPU',
    'hedgeOS',
  ],
  EMPLOYEE: [
    'user',
    'market-call',
    'market-call/:type?/:marketState?/:view?',
    'market-call/details/:id/:response?',
    'market-call/add',
    'task',
    'task/add',
    'cGPU',
    'hedgeOS',
  ],
  ANALYST: [
    'user',
    'analyst-task',
    'market-call',
    'market-call/:type?/:marketState?/:view?',
    'market-call/details/:id/:response?',
    'market-call/add',
    'cGPU',
    'hedgeOS',
  ],
  CLIENT: [
    'market-call',
    'market-call/:type?/:marketState?',
    'market-call/details/:id/:response?',
    'market-call/:type?/:marketState?/:view?',
    'market-call/confirmation',
    'responses',
    'cGPU',
    'hedgeOS',
  ],
};

export const getRouteFromRole = (role, protectedRoutes) => {
  if (role === ROLES.SUPER_ADMIN) return protectedRoutes;

  const filterRoutes = [];
  protectedRoutes?.forEach((route) => {
    if (roleBasedRoutes[role]?.includes(route?.path)) {
      filterRoutes.push(route);
    }
  });
  return filterRoutes;
};
