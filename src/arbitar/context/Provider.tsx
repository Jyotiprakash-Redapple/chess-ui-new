import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { reducer } from "./reducer/reducer";
import { initGame } from "./reducer/constant";

const AppContext = createContext({});
interface ProviderProps {
	children: ReactNode;
}

function Provider(props: ProviderProps) {
	const [appState, dispatch] = useReducer(reducer, initGame);
	const providerState = {
		appState,
		dispatch,
	};
	return <AppContext.Provider value={providerState}>{props.children}</AppContext.Provider>;
}
export function useAppContext() {
	return useContext(AppContext);
}

export default Provider;
