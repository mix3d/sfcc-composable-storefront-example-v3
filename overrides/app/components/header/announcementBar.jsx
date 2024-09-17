import React from 'react'
import {Content, isPreviewing} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'
import {useFetchOneEntry} from '~/builder/hooks'

const AnnouncementBar = () => {
    const {data: announcement, apiKey} = useFetchOneEntry({
        queryKey: ['Builder-Fetch-AnnouncementBar'],
        options: {
            model: builderConfig.announcementBarModel,
            // an example for how to use cacheSeconds for longer Builder CDN caching
            cacheSeconds: 120
        }
    })

    if (announcement || isPreviewing()) {
        return (
            <Content
                model={builderConfig.announcementBarModel}
                content={announcement}
                enrich={true}
                apiKey={apiKey}
                customComponents={customComponents}
            />
        )
    }
    return <></>
}

export default AnnouncementBar
