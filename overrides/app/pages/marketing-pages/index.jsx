import React, {useMemo, useState, useEffect} from 'react'
import loadable from '@loadable/component'
import {useLocation} from 'react-router-dom'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import {Box, Skeleton} from '@chakra-ui/react'
import {useQuery} from '@tanstack/react-query'

import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

import {
    Content,
    fetchOneEntry,
    isEditing,
    isPreviewing,
    subscribeToEditor
} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'

const PageNotFound = loadable(() => import('@salesforce/retail-react-app/app/pages/page-not-found'))

// const isServer = typeof window === 'undefined'

export const MarketingPage = () => {
    const location = useLocation()
    const config = getConfig()

    const [previewData, setPreviewData] = useState(null)

    const urlPath = location.pathname

    const {
        data: queryData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['Builder-Fetch-marketing', urlPath],
        queryFn: async () => {
            return await fetchOneEntry({
                model: builderConfig.pageModel,
                // not needed on fetchOneEntry
                // options: {
                //     enrich: true
                // },
                userAttributes: {urlPath},
                // query: {},
                apiKey: config.app.builder.api
            })
        },
        onSuccess: (data) => {
            setPreviewData(data)
        }
    })

    const data = useMemo(() => {
        return previewData ?? queryData
    }, [queryData, previewData])

    useEffect(() => {
        const unsubscribe = subscribeToEditor(builderConfig.pageModel, (data) =>
            setPreviewData(data)
        )
        return () => unsubscribe()
    }, [])

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
            {data && (
                <Seo
                    title={data.title}
                    description={data.description}
                    noIndex={data.noIndex}
                    keywords={data.keywords?.join(', ')}
                />
            )}
            <Content
                model={builderConfig.pageModel}
                content={data}
                apiKey={config.app.builder.api}
                enrich={true}
                customComponents={customComponents}
            />
        </Box>
    )
}

// eslint-disable-next-line
// MarketingPage.getProps = async ({res, api, location}) => {
//     const page = await builder
//         .get(builderConfig.pageModel, {
//             apiKey: builderConfig.apiKey,
//             url: location.pathname,
//             options: {
//                 includeRefs: true
//             }
//         })
//         .toPromise()
//         .catch((e) => {
//             console.error('Error getting page', e)
//         })

//     if (!page && res) {
//         res.status(404)
//     }

//     return {page}
// }

// MarketingPage.propTypes = {
//     page: PropTypes.any,
//     isLoading: PropTypes.bool
// }

export default MarketingPage
