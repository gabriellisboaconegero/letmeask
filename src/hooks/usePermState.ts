import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Response<S> = [
  S,
  Dispatch<SetStateAction<S>>
]

export function usePermState<T>(key: string, initialValue: T): Response<T>{
  const [state, setState] = useState(() => {
    const storageValue = window.localStorage.getItem(key);

    if(storageValue !== null){
      return JSON.parse(storageValue) as T;
    }
    return initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}