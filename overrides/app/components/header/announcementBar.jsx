import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import {Content, fetchOneEntry, isPreviewing} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'

const AnnouncementBar = () => {
    const config = getConfig()
    const {data: announcement} = useQuery({
        queryKey: ['Builder-Fetch-AnnouncementBar'],
        queryFn: async () => {
            return await fetchOneEntry({
                model: builderConfig.announcementBarModel,
                cacheSeconds: 120,
                apiKey: config.app.builder.api
            })
        }
    })

    if (announcement || isPreviewing()) {
        return (
            <Content
                model={builderConfig.announcementBarModel}
                content={announcement}
                enrich={true}
                apiKey={config.app.builder.api}
                customComponents={customComponents}
            />
        )
    }
    return <></>
}

export default AnnouncementBar
