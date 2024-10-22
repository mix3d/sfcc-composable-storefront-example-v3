/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

// Components
import {Box, Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'

// Project Components
import Seo from '@salesforce/retail-react-app/app/components/seo'

//Hooks
import useEinstein from '@salesforce/retail-react-app/app/hooks/use-einstein'

// Constants
import {MAX_CACHE_AGE} from '@salesforce/retail-react-app/app/constants'

import {useServerContext} from '@salesforce/pwa-kit-react-sdk/ssr/universal/hooks'

import {Content, isPreviewing} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'
import {useFetchOneEntry} from '~/builder/hooks'
import {setIvm} from '@builder.io/sdk-react/node/setIvm'

/**
 * This is the home page for Retail React App.
 * The page is created for demonstration purposes.
 * The page renders SEO metadata and a few promotion
 * categories and products, data is from local file.
 */
const Home = () => {
    const einstein = useEinstein()
    const {pathname} = useLocation()

    // console.log('DEBUG: Home before useServerContext')

    // useServerContext is a special hook introduced in v3 PWA Kit SDK.
    // It replaces the legacy `getProps` and provide a react hook interface for SSR.
    // it returns the request and response objects on the server side,
    // and these objects are undefined on the client side.
    const {res, req} = useServerContext()

    console.log('DEBUG: Home')
    if (res) {
        // console.log('DEBUG: Home res', res)

        res.set('Cache-Control', `s-maxage=${MAX_CACHE_AGE}`)
    }

    if (req) {
        console.log('DEBUG: Home req', req.foo)
        const foo = new req.foo.Isolate().createContextSync().evalSync('1 + 1')
        console.log('testing isolated-vm execution: ', foo)
        setIvm(req.foo)
    }

    const {data, apiKey, isLoading, isError} = useFetchOneEntry({
        queryKey: ['Builder-Fetch-Home'],
        options: {
            model: 'page',
            userAttributes: {urlPath: '/'}
        }
    })

    /**************** Einstein ****************/
    useEffect(() => {
        einstein.sendViewPage(pathname)
    }, [])

    return (
        <Box data-testid="home-page" layerStyle="page">
            <Seo
                title="Home Page"
                description="Commerce Cloud Retail React App"
                keywords="Commerce Cloud, Retail React App, React Storefront"
            />
            {isLoading && <Skeleton></Skeleton>}
            {((!isLoading && data) || isPreviewing('/')) && (
                <Content
                    model={builderConfig.pageModel}
                    content={data}
                    apiKey={apiKey}
                    enrich={true}
                    customComponents={customComponents}
                />
            )}
        </Box>
    )
}

Home.getTemplateName = () => 'home'

export default Home
