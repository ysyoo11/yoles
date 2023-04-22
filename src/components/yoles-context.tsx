import {
  Dispatch,
  ReactNode,
  Reducer,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { Product } from '@/backend/product/model';
import { SEARCH_HISTORY_KEY } from '@/constant/local-storage-key';

export type YolesState = {
  searchHistory: string[];
  trolleyItems: Product[];
};

const initialState: YolesState = {
  searchHistory: [],
  trolleyItems: [],
};

type YolesAction =
  | { type: 'SET_SEARCH_HISTORY'; searchHistory: string[] }
  | { type: 'SET_TROLLEY_ITEMS'; trolleyItems: Product[] };

export const YolesContext = createContext<YolesState>(initialState);

const yolesReducer: Reducer<YolesState, YolesAction> = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH_HISTORY':
      return { ...state, searchHistory: action.searchHistory };
    case 'SET_TROLLEY_ITEMS':
      return { ...state, trolleyItems: action.trolleyItems };
  }
};

type YolesStore = YolesState & {
  setSearchHistory: (searchHistory: string[]) => void;
  setTrolleyItems: Dispatch<SetStateAction<Product[]>>;
};

export function YolesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(yolesReducer, initialState);
  const [trolleyItems, setTrolleyItems] = useState<Product[]>([]);

  const setSearchHistory = (searchHistory: string[]) =>
    dispatch({ type: 'SET_SEARCH_HISTORY', searchHistory });

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    storedValue
      ? setSearchHistory(JSON.parse(storedValue))
      : setSearchHistory([]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(state.searchHistory)
    );
  }, [state.searchHistory]);

  const value = useMemo<YolesStore>(
    () => ({
      ...state,
      trolleyItems,
      setSearchHistory,
      setTrolleyItems,
    }),
    [state, trolleyItems]
  );

  return (
    <YolesContext.Provider value={value}>{children}</YolesContext.Provider>
  );
}

export const useYolesStore = () => {
  const context = useContext(YolesContext);

  if (context === undefined) {
    throw new Error('useYolesStore must be used within YolesProvider.');
  }

  return context as YolesStore;
};
