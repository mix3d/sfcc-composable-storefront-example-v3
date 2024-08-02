/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'

import {useLocation, useParams} from 'react-router-dom'
// import {useCategory} from '@salesforce/commerce-sdk-react'

// Builder.io
import {Content, isPreviewing} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'
import {useFetchOneEntry} from '~/builder/hooks'
// import {useSearchParams} from '@salesforce/retail-react-app/app/hooks'

const AbovePageHeader = () => {
    const location = useLocation()
    const urlParams = new URLSearchParams(location.search)
    let searchQuery = urlParams.get('q')
    const isSearch = !!searchQuery

    return isSearch ? <SearchHeader /> : <CategoryHeader />
}

const SearchHeader = () => {
    const urlParams = new URLSearchParams(location.search)
    let searchQuery = urlParams.get('q')

    const {data: pageHeader, apiKey} = useFetchOneEntry({
        queryKey: ['Builder-Fetch-SearchResults', searchQuery],
        options: {
            model: builderConfig.categoryHeroModel,
            userAttributes: {
                search: searchQuery
            }
        },
        // If you need to merchandize search queries shorter than 3 characters, remove this line (enabled by default)
        enabled: searchQuery.length > 3
    })

    if (pageHeader || isPreviewing())
        return (
            <Content
                apiKey={apiKey}
                model={builderConfig.categoryHeroModel}
                content={pageHeader}
                enrich={true}
                customComponents={customComponents}
            />
        )
}

const CategoryHeader = () => {
    const params = useParams()

    const {data: pageHeader, apiKey} = useFetchOneEntry({
        queryKey: ['Builder-Fetch-CategoryList', params.categoryId],
        options: {
            model: builderConfig.categoryHeroModel,
            userAttributes: {
                category: params.categoryId
            }
        },
        enabled: !!params.categoryId
    })

    if (pageHeader || isPreviewing())
        return (
            <Content
                apiKey={apiKey}
                model={builderConfig.categoryHeroModel}
                content={pageHeader}
                enrich={true}
                customComponents={customComponents}
            />
        )
}

export default AbovePageHeader
