import React from 'react'
import loadable from '@loadable/component'
import {useLocation, useParams} from 'react-router-dom'
import {Box, Skeleton} from '@chakra-ui/react'

import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

import {Content, isPreviewing} from '@builder.io/sdk-react'
import {useFetchOneEntry} from '~/builder/hooks'
import {customComponents} from '~/builder'

const PageNotFound = loadable(() => import('@salesforce/retail-react-app/app/pages/page-not-found'))

export const EditorPreview = () => {
    const location = useLocation()
    const config = getConfig()

    const urlPath = location.pathname
    const {modelName} = useParams()

    const {data, isLoading, isError} = useFetchOneEntry({
        queryKey: ['Builder-Editor-Preview', urlPath],
        options: {
            model: modelName,
            apiKey: config.app.builder.api
        }
    })

    if (isLoading) {
        return (
            <Box css={{minHeight: '100vh'}}>
                <Skeleton height="75vh" width="100%" />
            </Box>
        )
    }

    if (!isPreviewing(location.pathname) && isError) {
        return <PageNotFound />
    }

    return (
        <Box css={{minHeight: '100vh'}}>
            <Content
                model={modelName}
                content={data}
                apiKey={config.app.builder.api}
                enrich={true}
                customComponents={customComponents}
            />
        </Box>
    )
}

export default EditorPreview
