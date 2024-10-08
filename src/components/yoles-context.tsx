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

import { TrolleyProduct } from '@/backend/product/model';
import {
  SAVED_TROLLEY,
  SEARCH_HISTORY_KEY,
} from '@/constant/local-storage-key';

export type YolesState = {
  searchHistory: string[];
  trolleyItems: TrolleyProduct[];
};

const initialState: YolesState = {
  searchHistory: [],
  trolleyItems: [],
};

type YolesAction =
  | { type: 'SET_SEARCH_HISTORY'; searchHistory: string[] }
  | { type: 'SET_TROLLEY_ITEMS'; trolleyItems: TrolleyProduct[] };

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
  setTrolleyItems: Dispatch<SetStateAction<TrolleyProduct[]>>;
  total: {
    quantity: number;
    price: number;
  };
};

export function YolesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(yolesReducer, initialState);
  const [trolleyItems, setTrolleyItems] = useState<TrolleyProduct[]>([]);

  const setSearchHistory = (searchHistory: string[]) =>
    dispatch({ type: 'SET_SEARCH_HISTORY', searchHistory });

  const total = useMemo(() => {
    const qtyArray = trolleyItems.map((item) => item.quantity);
    const priceArray = trolleyItems.map((item) => item.price * item.quantity);
    return {
      quantity: qtyArray.reduce((partialSum, a) => partialSum + a, 0),
      price: priceArray.reduce((partialSum, a) => partialSum + a, 0),
    };
  }, [trolleyItems]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    storedValue
      ? setSearchHistory(JSON.parse(storedValue))
      : setSearchHistory([]);
  }, []);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SAVED_TROLLEY);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue) as Array<TrolleyProduct>;
      const parsedItems = parsedValue.map((item) => ({
        ...item,
        price: +item.price,
        quantity: +item.quantity,
      }));
      setTrolleyItems(parsedItems);
      return;
    }
    setTrolleyItems([]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(state.searchHistory)
    );
  }, [state.searchHistory]);

  useEffect(() => {
    window.localStorage.setItem(SAVED_TROLLEY, JSON.stringify(trolleyItems));
  }, [trolleyItems]);

  const value = useMemo<YolesStore>(
    () => ({
      ...state,
      trolleyItems,
      total,
      setSearchHistory,
      setTrolleyItems,
    }),
    [state, trolleyItems, total]
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
