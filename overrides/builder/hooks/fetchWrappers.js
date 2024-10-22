import {useMemo, useState, useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import {fetchEntries, fetchOneEntry, isPreviewing, subscribeToEditor} from '@builder.io/sdk-react'

const createQueryKeyArray = (stringOrArray) => {
    if (!stringOrArray) throw new Error('queryKey is required')
    if (typeof stringOrArray === 'string') return [stringOrArray]
    if (Array.isArray(stringOrArray)) return stringOrArray
    throw new Error('queryKey must be a string or array')
}
const fetchHookGenerator =
    (fetchFunction) =>
    ({queryKey, options, enabled = true}) => {
        const apiKey = getConfig().app.builder.api
        const query = useQuery({
            queryKey: createQueryKeyArray(queryKey),
            queryFn: async () => {
                return await fetchFunction({
                    apiKey,
                    ...options
                })
            },
            enabled
        })
        return {...query, apiKey}
    }

/**
 * Wraps the Builder.io fetchEntries function with PWAKit compatible React Query
 * Abstracts API key fetching
 * If you are confident you do not need to subcribe to Model changes, you can export this hook instead
 */
const useFetchEntriesInternal = fetchHookGenerator(fetchEntries)

/**
 * Wraps the Builder.io fetchEntries function with PWAKit compatible React Query,
 * and adds a subscription to the Builder.io editor for live data-model previewing.
 * This is required for live previewing Model data (not Visual elements).
 * See https://www.builder.io/c/docs/content-api#content-api-query-params on Gen2 SDK for available `options` keys,
 *   with the exception that the apiKey will be added automatically
 */
export const useFetchEntries = ({queryKey, options, enabled = true}) => {
    const [previewData, setPreviewData] = useState([])
    const {data: queryData, ...queryRest} = useFetchEntriesInternal({queryKey, options, enabled})

    useEffect(() => {
        // subscribeToEditor() returns an unsubscribe cleanup function
        // Run this on the useEffect cleanup to avoid memory leaks
        // Only Subscribe when in Preview mode
        if (isPreviewing())
            // wrap the previewData in an array to match the shape of the queryData on fetchEntries
            return subscribeToEditor(options.model, (data) => setPreviewData([data]))
    }, [])

    const memoData = useMemo(() => {
        return previewData.length ? previewData : queryData
    }, [queryData, previewData])

    return {data: memoData, ...queryRest}
}

/**
 * Wraps the Builder.io fetchOneEntry function with PWAKit compatible React Query
 * Abstracts API key fetching
 * If you are confident you do not need to subcribe to Model changes, you can export this hook instead
 */
const useFetchOneEntryInternal = fetchHookGenerator(fetchOneEntry)

/**
 * Wraps the Builder.io fetchOneEntry function with PWAKit compatible React Query,
 * and adds a subscription to the Builder.io editor for live data-model previewing.
 * This is required for live previewing Model data (not Visual elements).
 * See https://www.builder.io/c/docs/content-api#content-api-query-params on Gen2 SDK for available `options` keys,
 *   with the exception that the apiKey will be added automatically
 */
export const useFetchOneEntry = ({queryKey, options, enabled = true}) => {
    const [previewData, setPreviewData] = useState(null)
    const {data: queryData, ...queryRest} = useFetchOneEntryInternal({queryKey, options, enabled})

    useEffect(() => {
        // subscribeToEditor() returns an unsubscribe cleanup function
        // Run this on the useEffect cleanup to avoid memory leaks
        // Only Subscribe when in Preview mode
        if (isPreviewing()) return subscribeToEditor(options.model, (data) => setPreviewData(data))
    }, [])

    const memoData = useMemo(() => {
        return previewData ?? queryData
    }, [queryData, previewData])

    return {data: memoData, ...queryRest}
}
