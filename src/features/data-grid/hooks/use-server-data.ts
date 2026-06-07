"use client"
import { useEffect, useMemo, useRef, useState } from 'react';

import type {
    DataGridServerAdapter,
    DataGridServerQuery,
    DataGridServerResult,
    DataGridTableInstance,
    TableStoreState,
} from '../core/types';

function buildServerQuery(state: TableStoreState): DataGridServerQuery {
    return {
        search: state.search.query,
        sorting: state.sorting.sortModel,
        filters: state.filters,
        pagination: state.pagination,
    };
}

function areQueriesEqual(
    a: DataGridServerQuery | null,
    b: DataGridServerQuery,
): boolean {
    if (!a) {
        return false;
    }

    return JSON.stringify(a) === JSON.stringify(b);
}

export function useServerData<TData = unknown>(
    instance: DataGridTableInstance,
    adapter?: DataGridServerAdapter<TData>,
): any {
    const resolvedAdapter: any =
        adapter ?? (instance.server?.adapter as DataGridServerAdapter<TData> | undefined);

    const [data, setData] = useState<TData[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const requestIdRef = useRef(0);
    const prevQueryRef = useRef<DataGridServerQuery | null>(null);

    const query = useMemo(
        () => buildServerQuery(instance.store.getState()),
        [instance],
    );

    useEffect(() => {
        if (!resolvedAdapter?.fetchRows) {
            return;
        }

        if (areQueriesEqual(prevQueryRef.current, query)) {
            return;
        }

        prevQueryRef.current = query;
        requestIdRef.current += 1;
        const requestId = requestIdRef.current;

        let active = true;

        async function run(): Promise<void> {
            try {
                setLoading(true);
                setError(null);

                const result: DataGridServerResult<TData> =
                    await resolvedAdapter.fetchRows(query, instance);

                if (!active || requestId !== requestIdRef.current) {
                    return;
                }

                setData(result.rows);
                setTotal(result.total);

                instance.store.getState().setPagination({
                    ...instance.store.getState().pagination,
                    total: result.total,
                });
            } catch (err) {
                if (!active || requestId !== requestIdRef.current) {
                    return;
                }

                setError(err);
            } finally {
                if (!active || requestId !== requestIdRef.current) {
                    return;
                }

                setLoading(false);
            }
        }

        void run();

        const unsubscribe = instance.store.subscribe((state) => {
            const nextQuery = buildServerQuery(state);

            if (areQueriesEqual(prevQueryRef.current, nextQuery)) {
                return;
            }

            prevQueryRef.current = nextQuery;
            requestIdRef.current += 1;
            const nextRequestId = requestIdRef.current;

            void (async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const result = await resolvedAdapter.fetchRows(nextQuery, instance);

                    if (!active || nextRequestId !== requestIdRef.current) {
                        return;
                    }

                    setData(result.rows);
                    setTotal(result.total);

                    instance.store.getState().setPagination({
                        ...instance.store.getState().pagination,
                        total: result.total,
                    });
                } catch (err) {
                    if (!active || nextRequestId !== requestIdRef.current) {
                        return;
                    }

                    setError(err);
                } finally {
                    if (!active || nextRequestId !== requestIdRef.current) {
                        return;
                    }

                    setLoading(false);
                }
            })();
        });

        return () => {
            active = false;
            unsubscribe();
        };
    }, [instance, query, resolvedAdapter]);

    return {
        rows: data,
        total,
        loading,
        error,
        refetch: async () => {
            if (!resolvedAdapter?.fetchRows) {
                return;
            }

            const nextQuery = buildServerQuery(instance.store.getState());

            requestIdRef.current += 1;
            const requestId = requestIdRef.current;

            try {
                setLoading(true);
                setError(null);

                const result = await resolvedAdapter.fetchRows(nextQuery, instance);

                if (requestId !== requestIdRef.current) {
                    return;
                }

                setData(result.rows);
                setTotal(result.total);

                instance.store.getState().setPagination({
                    ...instance.store.getState().pagination,
                    total: result.total,
                });
            } catch (err) {
                if (requestId !== requestIdRef.current) {
                    return;
                }

                setError(err);
            } finally {
                if (requestId !== requestIdRef.current) {
                    return;
                }

                setLoading(false);
            }
        },
    };
}
