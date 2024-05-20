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
import builderConfig from '~/builder/map.js'
import {customComponents} from '~/builder/blocks'
import {isServer} from '@salesforce/retail-react-app/app/utils/utils'

const PageNotFound = loadable(() => import('@salesforce/retail-react-app/app/pages/page-not-found'))

// const isServer = typeof window === 'undefined'

export const MarketingPage = () => {
    const location = useLocation()
    const config = getConfig()

    const [previewData, setPreviewData] = useState(null)

    const slug = location.pathname

    const {
        data: queryData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['Builder-Fetch-marketing', slug],
        queryFn: async () => {
            const result = await fetchOneEntry({
                model: builderConfig.pageModel,
                // not neded on fetchOneEntry
                // options: {
                //     enrich: true
                // },
                url: slug,
                // query: {},
                apiKey: config.app.builder.api
            })
            return result
        },
        onSuccess: (data) => {
            setPreviewData(data)
        },
        enabled: !isServer
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
    let header = <></>
    if (data) {
        const {title, description, keywords, noIndex} = data
        header = (
            <Seo
                title={title}
                description={description}
                noIndex={noIndex}
                keywords={keywords?.join(', ')}
            />
        )
    }

    return (
        <Box css={{minHeight: '100vh'}}>
            {header}
            <Content
                model={builderConfig.pageModel}
                content={data}
                apiKey={config.app.builder.api}
                enrich={true}
                customComponents={customComponents}
            />
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
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
