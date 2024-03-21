import { AbilityBuilder, Ability } from '@casl/ability';
import { UserRole } from '../utils/types/auth';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Access = 'access',
}
//Ability.ts
export function defineRulesFor(role: any) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);
  if (role === UserRole.SUPERADMIN) {
    can(Action.Manage, 'all');
  } else if (role === UserRole.MANAGER) {
    can(Action.Read, 'all');
    can(Action.Manage, 'task');
    cannot(Action.Access, 'admin');
    cannot(Action.Delete, 'task');
  } else if (role === UserRole.SUBORDINATE) {
    can(Action.Read, ['task', 'reports']);
    can(Action.Access, UserRole.SUBORDINATE); // Уточнение права на доступ
  }
  return new Ability(rules);
}
