import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import BaseProductScroller from '@salesforce/retail-react-app/app/components/product-scroller'

import ProductsProvider from '~/builder/utils/products-provider'
// import useIntersectionObserver from '@salesforce/retail-react-app/app/hooks/use-intersection-observer'
// import {Box} from '@salesforce/retail-react-app/app/components/shared/ui'

/**
 * A component for fetching and rendering a list of products from Builder
 */
const ProductsScroller = ({productIds, title, header, ...props}) => {
    const ref = useRef()
    // Onscreen intersection obverser could be used to start loading
    // const isOnScreen = useIntersectionObserver(ref, {useOnce: true})
    // if (!isOnScreen) return <Box ref={ref} />

    return (
        <ProductsProvider productIds={productIds}>
            {({products, isLoading, wishlist, removeItemFromWishlist, addItemToWishlist}) => (
                <BaseProductScroller
                    ref={ref}
                    title={title}
                    header={header}
                    products={products}
                    isLoading={isLoading}
                    productTileProps={(product) => ({
                        enableFavourite: true,
                        isFavourite: wishlist?.customerProductListItems?.some(
                            (item) => item.productId === product?.productId
                        ),
                        onFavouriteToggle: (isFavourite) => {
                            const action = isFavourite ? removeItemFromWishlist : addItemToWishlist
                            return action(product)
                        }
                    })}
                    {...props}
                />
            )}
        </ProductsProvider>
    )
}

ProductsScroller.propTypes = {
    productIds: PropTypes.array,
    title: PropTypes.any,
    header: PropTypes.any
}
export default ProductsScroller
