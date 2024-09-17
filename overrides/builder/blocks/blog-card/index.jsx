import React, {useEffect, useState} from 'react'
import {Text, Skeleton} from '@salesforce/retail-react-app/app/components/shared/ui'
import loadable from '@loadable/component'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {useFetchOneEntry} from '~/builder/hooks'
import {isPreviewing} from '@builder.io/sdk-react'

const fallback = <Skeleton height="75vh" width="100%" />
const BlogCard = loadable(() => import('./blog-card'), {fallback})

export function BuilderBlogCard(props) {
    const {
        data: article,
        isLoading,
        isError
    } = useFetchOneEntry({
        queryKey: ['Builder-Fetch-blog', props.article?.id],
        options: {
            model: props.article.model,
            query: {
                id: props.article.id
            }
        }
    })

    // TODO: use isLoading to render a skeleton

    if (article) {
        console.log('ARTICLE', article)
        return (
            <Link to={`/blog/${article.data?.slug}`}>
                <BlogCard
                    isColumn={props.isColumn}
                    date={new Date(article.lastUpdated || Date.now())}
                    keywords={article.data.keywords || []}
                    title={article.data.title}
                    excerpt={article.data.excerpt}
                    image={article.data.image}
                    author={article.data.author.value?.data || {}}
                />
            </Link>
        )
    }
    return isPreviewing() ? <Text>Pick an article</Text> : null
}

BuilderBlogCard.propTypes = {
    article: PropTypes.any,
    isColumn: PropTypes.bool
}

export const BlogCardDefinition = {
    component: BuilderBlogCard,
    name: 'BlogCard',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fd1ed12c3338144da8dd6b63b35d14c30%2Fbcac0e5a87ac4ad29b37d5159a63dbca',
    inputs: [
        {
            name: 'article',
            type: 'reference',
            model: 'blog-article'
        },
        {
            name: 'isColumn',
            friendlyName: 'Stack vertically',
            type: 'boolean'
        }
    ]
}
