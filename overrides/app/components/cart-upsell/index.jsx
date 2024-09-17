import React from 'react'
import PropTypes from 'prop-types'
import {Box} from '@salesforce/retail-react-app/app/components/shared/ui'
import {Content, isPreviewing} from '@builder.io/sdk-react'
import {customComponents, builderConfig} from '~/builder'
import {useFetchOneEntry} from '~/builder/hooks'

const CartUpsell = ({product}) => {
    const {data: cartUpsell, apiKey} = useFetchOneEntry({
        queryKey: ['Builder-Fetch-CartUpsell'],
        options: {
            model: builderConfig.cartUpsellModel,
            userAttributes: {
                product: product?.master?.masterId
            }
        }
    })

    return (
        <Box padding="8">
            {(isPreviewing() || cartUpsell) && (
                <Content
                    model={builderConfig.cartUpsellModel}
                    content={cartUpsell}
                    enrich={true}
                    apiKey={apiKey}
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
