import { Navigate, Outlet } from 'react-router-dom';
import { Action } from '../../ability/Ability';
import { useAbility } from '@casl/react';
import { AbilityContext } from '../../ability/AbilityContext';
import { FC } from 'react';

export const RoleGuard: FC = () => {
  const ability = useAbility(AbilityContext);

  if (!ability.can(Action.Access, 'admin')) {
    return <Navigate to="/crm" />;
  }
  return <Outlet />;
};

export default RoleGuard;
