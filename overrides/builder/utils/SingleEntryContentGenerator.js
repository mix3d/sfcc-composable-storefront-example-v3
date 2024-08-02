import React from 'react'
import {Content, isPreviewing} from '@builder.io/sdk-react'
import {useFetchOneEntry} from '~/builder/hooks'
import {customComponents as defaultCustomComponents} from '~/builder'

/**
 * A Component Generator to make creating Builder.io content fetching components simple.
 * Defaults to all customComponents available, but can take a customComponents prop to override.
 * Useful when you only have a single content area/slot where no additional JSX is needed,
 *   just "fetch and render content here please."
 * Can optionally show a content skeleton while loading.
 */
export const SingleEntryContentGenerator = ({
    queryKey,
    options,
    enabled = true,
    skeleton = null,
    customComponents = defaultCustomComponents
}) => {
    const BuilderComponent = () => {
        const {data, isLoading, isError, apiKey} = useFetchOneEntry({queryKey, options, enabled})

        if ((!data && !isLoading) || !isPreviewing()) return null
        // OPTIONAL: handle error state to meet your requirements
        if (isError) return null
        if (!isPreviewing() && isLoading && skeleton) return skeleton

        return (
            <Content
                model={options.model}
                content={data}
                enrich={options.enrich ?? true}
                apiKey={apiKey}
                customComponents={customComponents}
            />
        )
    }
    return BuilderComponent
}
