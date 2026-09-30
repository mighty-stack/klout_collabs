import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';

let cache = null;

// Dropdown values (categories, niches, locations, interests) from the API, fetched once.
export function useOptions() {
  const [options, setOptions] = useState(cache);
  const [error, setError] = useState(null);

  const load = useCallback(async (force = false) => {
    if (cache && !force) return;
    setError(null);
    try {
      cache = await api('/options');
      setOptions(cache);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { options, error, reload: () => load(true) };
}

export const clearOptionsCache = () => {
  cache = null;
};
