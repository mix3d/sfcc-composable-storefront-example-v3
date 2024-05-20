import React from 'react'
import PageNotFound from '@salesforce/retail-react-app/app/pages/page-not-found'
import {useLocation} from 'react-router-dom'
import Seo from '@salesforce/retail-react-app/app/components/seo'
// TODO: replace with the SF internal wrapper ones
import {Box, Container, Skeleton} from '@chakra-ui/react'

import builderConfig from '~/builder/map.js'
import BlogCard from '~/builder/blocks/blog-card/blog-card.jsx'
import {useQuery} from '@tanstack/react-query'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

// import {BuilderComponent, builder, useIsPreviewing, BuilderContent} from '@builder.io/react'
import {Content, fetchOneEntry, isEditing, isPreviewing} from '@builder.io/sdk-react'

export const BlogPage = () => {
    const config = getConfig()
    const location = useLocation()
    const slug = location.pathname.replace('/blog/', '')

    const {data: blog, isLoading} = useQuery({
        queryKey: ['Builder-Fetch-blog', slug],
        queryFn: async () => {
            const blog = await fetchOneEntry({
                model: builderConfig.blogArticleModel,
                query: {
                    data: {
                        slug
                    }
                },
                apiKey: config.app.builder.api
            })
            console.log('\n\n==============\n', {blog}, '\n\n==============\n')
            return blog
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

    if (!isPreviewing(location.pathname) && !isLoading && !blog) {
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
                        apiKey={config.app.builder.api}
                    />
                </Container>
            )}
        </Box>
    )
}

export default BlogPage
