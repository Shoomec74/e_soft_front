import { Navigate, Outlet } from "react-router-dom";
import { Action } from "../../ability/Ability";
import { useAbility } from "@casl/react";
import { AbilityContext } from "../../ability/AbilityContext";
import { UserRole } from "../../utils/types/auth";

export const RoleGuard: React.FC = () => {
  const ability = useAbility(AbilityContext);

    if (!ability.can(Action.Access, 'admin')) {
      return <Navigate to="/crm" />;
    }
    return <Outlet />;
  };

  export default RoleGuard;
