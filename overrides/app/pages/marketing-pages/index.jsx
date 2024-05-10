import React from 'react'

import {useHistory, useLocation, useParams} from 'react-router-dom'
import PageNotFound from '@salesforce/retail-react-app/app/pages/page-not-found'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import {Box, Skeleton} from '@chakra-ui/react'
import PropTypes from 'prop-types'

import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

import {
    Content,
    fetchEntries,
    fetchOneEntry,
    isEditing,
    isPreviewing,
    getBuilderSearchParams
} from '@builder.io/sdk-react'
import builderConfig from '~/builder/map.js'

export const MarketingPage = ({isLoading}) => {
    const location = useLocation()
    const isPreviewing = isPreviewing(location.pathname)
    if (isLoading) {
        return (
            <Box css={{minHeight: '100vh'}}>
                <Skeleton height="75vh" width="100%" />
            </Box>
        )
    }

    if (!isPreviewing && !page.data) {
        return <PageNotFound />
    }
    let header = <></>
    if (page.data) {
        const {title, description, keywords, noIndex} = page.data
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
            <Component
                model={builderConfig.pageModel}
                content={page}
                options={{includeRefs: true}}
            />
        </Box>
    )
}

// eslint-disable-next-line
MarketingPage.getProps = async ({res, api, location}) => {
    const page = await builder
        .get(builderConfig.pageModel, {
            apiKey: builderConfig.apiKey,
            url: location.pathname,
            options: {
                includeRefs: true
            }
        })
        .toPromise()
        .catch((e) => {
            console.error('Error getting page', e)
        })

    if (!page && res) {
        res.status(404)
    }

    return {page}
}

MarketingPage.propTypes = {
    page: PropTypes.any,
    isLoading: PropTypes.bool
}

export default MarketingPage
