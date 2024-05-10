import React from 'react'
import PageNotFound from '@salesforce/retail-react-app/app/pages/page-not-found'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import Seo from '@salesforce/retail-react-app/app/components/seo'

import {Box, Container, Skeleton} from '@chakra-ui/react'
import PropTypes from 'prop-types'
import builderConfig from '~/builder/map.js'

import BlogCard from '~/builder/blocks/blog-card'

import {useQuery} from '@tanstack/react-query'

import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

// import {BuilderComponent, builder, useIsPreviewing, BuilderContent} from '@builder.io/react'
import {
    Content,
    fetchEntries,
    fetchOneEntry,
    isEditing,
    isPreviewing,
    getBuilderSearchParams
} from '@builder.io/sdk-react'

export const BlogPage = (params) => {
    const {article, isLoading} = params

    const config = getConfig()
    const location = useLocation()
    const slug = location.pathname.replace('/blog/', '')

    const query = useQuery(['Builder-Fetch-blog', slug], () =>
        fetchOneEntry({
            model: builderConfig.blogArticleModel,
            options: {
                includeRefs: true
            },
            query: {
                data: {
                    slug
                }
            },
            apiKey: config.app.builder.api
        })
    )

    if (isLoading) {
        return (
            <Box css={{minHeight: '100vh'}}>
                <Skeleton height="75vh" width="100%" />
            </Box>
        )
    }

    if (!isPreviewing(location.pathname) && !query.data) {
        return <PageNotFound />
    }

    return (
        <Box css={{minHeight: '100vh'}}>
            <Content
                content={article}
                options={{includeRefs: true}}
                model={builderConfig.blogArticleModel}
            >
                {(content, loading, full) => {
                    const {title, excerpt, keywords, noIndex, author, image} = content || {}
                    return (
                        content && (
                            <Container maxW={'7xl'} p="12">
                                <Seo
                                    title={title}
                                    description={excerpt}
                                    noIndex={noIndex}
                                    keywords={keywords?.join(', ')}
                                />
                                <BlogCard
                                    date={new Date(full.lastUpdated || Date.now())}
                                    image={image}
                                    keywords={keywords || []}
                                    excerpt={excerpt || 'lorem Ipsum'}
                                    author={author?.value?.data || {}}
                                    title={title || 'Untitled'}
                                />
                                <Content
                                    model={builderConfig.blogArticleModel}
                                    content={article}
                                    options={{includeRefs: true}}
                                    apiKey={config.app.builder.api}
                                />
                            </Container>
                        )
                    )
                }}
            </Content>
        </Box>
    )
}
// eslint-disable-next-line
BlogPage.getProps = async ({res, api, location}) => {
    console.log(' here ', location.pathname)
    const slug = location.pathname.split('/')[2]
    const article = await builder
        .get(builderConfig.blogArticleModel, {
            options: {
                includeRefs: true
            },
            query: {
                data: {
                    slug
                }
            }
        })
        .toPromise()

    if (!article && res) {
        res.status(404)
    }

    return {article}
}

BlogPage.propTypes = {
    article: PropTypes.any,
    /*
     * Indicated that `getProps` has been called but has yet to complete.
     *
     * Notes: This prop is internally provided.
     */
    isLoading: PropTypes.bool
}

export default BlogPage
