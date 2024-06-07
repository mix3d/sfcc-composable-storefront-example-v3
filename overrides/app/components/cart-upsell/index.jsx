import React from 'react'
import PropTypes from 'prop-types'
import {Box} from '@chakra-ui/react'
import {useQuery} from '@tanstack/react-query'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import {Content, fetchOneEntry, isPreviewing} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'

const CartUpsell = ({product}) => {
    const config = getConfig()
    const {data: cartUpsell} = useQuery({
        queryKey: ['Builder-Fetch-CartUpsell'],
        queryFn: async () => {
            return await fetchOneEntry({
                model: builderConfig.cartUpsellModel,
                enrich: true,
                apiKey: config.app.builder.api,
                userAttributes: {
                    product: product?.master?.masterId
                }
            })
        }
    })

    return (
        <Box padding="8">
            {(isPreviewing() || cartUpsell) && (
                <Content
                    model={builderConfig.cartUpsellModel}
                    content={cartUpsell}
                    enrich={true}
                    apiKey={config.app.builder.api}
                    data={{product}}
                    customComponents={customComponents}
                />
            )}
        </Box>
    )
}

CartUpsell.propTypes = {
    product: PropTypes.object
}

export default CartUpsell
