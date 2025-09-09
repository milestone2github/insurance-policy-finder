// Progress Context Hook

import { createContext, useContext } from "react";

export const ProgressContext = createContext(0);
export const useProgressValue = () => useContext(ProgressContext);
