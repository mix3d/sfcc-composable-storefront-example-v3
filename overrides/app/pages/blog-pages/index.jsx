import React from 'react'
import PageNotFound from '@salesforce/retail-react-app/app/pages/page-not-found'
import {useLocation} from 'react-router-dom'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import {Box, Container, Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'

import BlogCard from '~/builder/blocks/blog-card/blog-card.jsx'

import {Content, isPreviewing} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'
import {useFetchOneEntry} from '~/builder/hooks'

export const BlogPage = () => {
    const location = useLocation()
    const slug = location.pathname.replace('/blog/', '')

    const {
        data: blog,
        isLoading,
        isError,
        apiKey
    } = useFetchOneEntry({
        queryKey: ['Builder-Fetch-blog', slug],
        options: {
            model: builderConfig.blogArticleModel,
            query: {
                data: {
                    slug
                }
            }
        }
    })

    // TODO: is this the right way to do it?
    const {title, excerpt, keywords, noIndex, author, image, lastUpdated} = blog?.data || {}

    if (isLoading) {
        return (
            <Box css={{minHeight: '100vh'}}>
                <Skeleton height="75vh" width="100%" />
            </Box>
        )
    }

    if ((!isPreviewing(location.pathname) && !isLoading && !blog) || isError) {
        return <PageNotFound />
    }

    return (
        <Box css={{minHeight: '100vh'}}>
            {blog && (
                <Container maxW={'7xl'} p="12">
                    <Seo
                        title={title}
                        description={excerpt}
                        noIndex={noIndex}
                        keywords={keywords?.join(', ')}
                    />
                    <BlogCard
                        date={new Date(lastUpdated || Date.now())}
                        image={image}
                        keywords={keywords || []}
                        excerpt={excerpt || 'lorem Ipsum'}
                        author={author?.value?.data || {}}
                        title={title || 'Untitled'}
                    />
                    <Content
                        model={builderConfig.blogArticleModel}
                        content={blog}
                        enrich={true}
                        apiKey={apiKey}
                        customComponents={customComponents}
                    />
                </Container>
            )}
        </Box>
    )
}

export default BlogPage
