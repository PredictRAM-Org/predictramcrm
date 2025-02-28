import React from 'react';
import { useSelector } from 'react-redux';

function AccessControl({ accepted_roles, children }) {
  const { role } = useSelector((state) => state.user.details);

  if (accepted_roles.includes(role)) return <>{children}</>;
}

export default AccessControl;
