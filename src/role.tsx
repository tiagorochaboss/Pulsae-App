import { createContext, useContext } from 'react';
import { Role } from './store';

// Which side of the demo is open (customer or professional) and app-level actions.
export type AppCtx = {
  role: Role;
  switchRole: (r: Role) => void;
  logout: () => void;
};
export const AppContext = createContext<AppCtx>({ role: 'customer', switchRole: () => {}, logout: () => {} });
export const useApp = () => useContext(AppContext);
