import { debounce } from "@mui/material";

import Observable from "@nadabot/utils/observable";

type IsHumanCacheProps = Record<
  string,
  {
    expiresAt: number;
    isHuman: boolean;
  }
>;

const IS_HUMAN_CACHE_CHECK_KEY = "is_human_cache";

// Get Cache
const cachedDataStr =
  typeof window === "undefined" // Should use localstorage when running on client side only
    ? "{}"
    : localStorage.getItem(IS_HUMAN_CACHE_CHECK_KEY);

export const isHumanCache: IsHumanCacheProps = cachedDataStr
  ? JSON.parse(cachedDataStr)
  : {};

export const isHumanCacheUpdatedObservable =
  new Observable<IsHumanCacheProps>();

const persistData = () => {
  localStorage.setItem(IS_HUMAN_CACHE_CHECK_KEY, JSON.stringify(isHumanCache));
};

// Persist after 1 sec of inactivity
const debouncedPersistData = debounce(persistData, 1000);

isHumanCacheUpdatedObservable.subscribe(() => {
  debouncedPersistData();
});
