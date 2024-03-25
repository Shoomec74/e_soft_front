import React from 'react';
import { Ability } from '@casl/ability';
import { createContextualCan } from '@casl/react';

export const AbilityContext = React.createContext(new Ability());
export const Can = createContextualCan(AbilityContext.Consumer); //-- Для рендеринга компонентов по ролям и пр. правилам --//
