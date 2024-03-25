import { AbilityBuilder, Ability } from '@casl/ability';
import { UserRole } from '../utils/types/types';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Access = 'access',
}

export function defineRulesFor(role: any) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);
  if (role === UserRole.SUPERADMIN) {
    can(Action.Manage, 'all');
  } else if (role === UserRole.MANAGER) {
    cannot(Action.Access, 'admin');
    can(Action.Access, 'formField'); //-- У менеджера полный доступ ко всем полям форм --//
    can(Action.Access, 'subordinate'); //-- У менеджера полный доступ ко всем полям форм --//
  } else if (role === UserRole.SUBORDINATE) {
    can(Action.Update, ['task']);
    cannot(Action.Access, 'admin');
    cannot(Action.Access, 'subordinate'); //-- У пользователя не полный доступ ко всем полям форм --//
    cannot(Action.Access, 'formField'); //-- У пользователя не полный доступ ко всем полям форм --//
  }
  return new Ability(rules);
}
