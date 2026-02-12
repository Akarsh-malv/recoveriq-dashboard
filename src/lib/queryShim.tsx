import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';

type QueryStatus = 'idle' | 'loading' | 'error' | 'success';

interface UseQueryOptions<TData> {
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  keepPreviousData?: boolean;
}

interface UseQueryResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

export class QueryClient {}

const QueryClientContext = createContext<QueryClient | null>(null);

export function QueryClientProvider({ client, children }: { client: QueryClient; children: ReactNode }) {
  return <QueryClientContext.Provider value={client}>{children}</QueryClientContext.Provider>;
}

export function useQuery<TData>({ queryKey, queryFn }: UseQueryOptions<TData>): UseQueryResult<TData> {
  const keyRef = useRef<string>(JSON.stringify(queryKey));
  const [data, setData] = useState<TData | undefined>(undefined);
  const [status, setStatus] = useState<QueryStatus>('idle');

  const run = useMemo(
    () => async () => {
      setStatus('loading');
      try {
        const result = await queryFn();
        setData(result);
        setStatus('success');
      } catch (err) {
        console.error('useQuery error', err);
        setStatus('error');
      }
    },
    [queryFn]
  );

  useEffect(() => {
    const key = JSON.stringify(queryKey);
    if (key !== keyRef.current || status === 'idle') {
      keyRef.current = key;
      run();
    }
  }, [queryKey, status, run]);

  return {
    data,
    isLoading: status === 'loading',
    isError: status === 'error',
    refetch: run,
  };
}
