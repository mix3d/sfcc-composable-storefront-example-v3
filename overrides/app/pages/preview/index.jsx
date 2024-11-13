import React, {useMemo} from 'react'
import loadable from '@loadable/component'
import {useLocation, useParams} from 'react-router-dom'
import {Box, Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'

import {customComponents} from '~/builder'
import {SingleEntryContentGenerator} from '~/builder/utils/SingleEntryContentGenerator'

import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import {Content} from '@builder.io/sdk-react'

const PageNotFound = loadable(() => import('@salesforce/retail-react-app/app/pages/page-not-found'))

export const EditorPreview = () => {
    const {modelName} = useParams()

    const apiKey = getConfig().app.builder.api

    return <Content model={modelName} apiKey={apiKey} customComponents={customComponents} />
}

// Makes use of the SingleEntryContentGenerator to wrap all the Builder stuff
export const ComplexEditorPreview = () => {
    const location = useLocation()

    const urlPath = location.pathname
    const {modelName} = useParams()

    const Entry = useMemo(
        () =>
            SingleEntryContentGenerator({
                queryKey: [`Builder-Editor-Preview-${modelName}`, urlPath],
                options: {
                    model: modelName
                },
                skeletonComponent: (
                    <Box css={{minHeight: '100vh'}}>
                        <Skeleton height="75vh" width="100%" />
                    </Box>
                ),
                errorComponent: <PageNotFound />,
                // for surfacing customcomponents to Builder's visual Editor
                customComponents
            }),
        [urlPath, modelName]
    )

    return (
        <Box css={{minHeight: '100vh'}}>
            <Entry />
        </Box>
    )
}

export default EditorPreview
