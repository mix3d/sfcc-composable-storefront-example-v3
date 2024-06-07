import React, {useMemo, useState, useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import {Content, fetchOneEntry, isPreviewing, subscribeToEditor} from '@builder.io/sdk-react'
import {customComponents} from '~/builder'

// One approach, a Component Generator to make creating Builder.io content fetching components simple
// Always has all customComponents available
export const BuilderContentWrapperGenerator = ({queryKey, model, options = {}, skeleton}) => {
    const BuilderComponent = () => {
        const config = getConfig()
        const {data, isLoading, isError} = useQuery({
            queryKey: [...(typeof queryKey === 'string' ? [queryKey] : queryKey)],
            queryFn: async () => {
                return await fetchOneEntry({
                    model,
                    apiKey: config.app.builder.api,
                    ...options
                })
            }
        })

        if ((!data && !isLoading) || !isPreviewing()) return null
        if (!isPreviewing() && isLoading && skeleton) return skeleton
        return (
            <Content
                model={model}
                content={data}
                enrich={options.enrich ?? false}
                apiKey={config.app.builder.api}
                customComponents={customComponents}
            />
        )
    }
    return BuilderComponent
}

// A more Hooks-based approach, for React-style fetching, must render the Content component manually
// Get to choose Content props manually
export const useFetchOneEntry = ({queryKey, options, enabled = true}) => {
    const apiKey = getConfig().app.builder.api
    const {data, isLoading, isError} = useQuery({
        queryKey: [
            ...(typeof queryKey === 'string'
                ? [queryKey]
                : Array.isArray(queryKey)
                ? queryKey
                : ['Builder-Fetch-Content'])
        ],
        queryFn: async () => {
            return await fetchOneEntry({
                apiKey,
                ...options
            })
        },
        enabled
    })

    return {data, isLoading, isError, apiKey}
}

// FetchOneEntry but also listen to PageModel changes
export const useFetchOneEntrWithListener = ({queryKey, options, enabled = true}) => {
    const apiKey = getConfig().app.builder.api
    const [previewData, setPreviewData] = useState(null)
    const {
        data: queryData,
        isLoading,
        isError
    } = useQuery({
        queryKey: [
            ...(typeof queryKey === 'string'
                ? [queryKey]
                : Array.isArray(queryKey)
                ? queryKey
                : ['Builder-Fetch-Content'])
        ],
        queryFn: async () => {
            return await fetchOneEntry({
                apiKey,
                ...options
            })
        },
        onSuccess: (data) => {
            setPreviewData(data)
        },
        enabled
    })

    const memoData = useMemo(() => {
        return previewData ?? queryData
    }, [queryData, previewData])

    useEffect(() => {
        const unsubscribe = subscribeToEditor(options.model, (data) => setPreviewData(data))
        return () => unsubscribe()
    }, [])

    return {data: memoData, isLoading, isError, apiKey}
}
