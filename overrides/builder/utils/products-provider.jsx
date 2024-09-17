/*
 * A Wrapper component for fetching a list of Products by ID,
 * and converting to a similar format as the ProductSearch API provides.
 * The useProducts hook results don't match the useProductSearch format, which most PWAKit components expect.
 */
import React, {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {useIntl} from 'react-intl'
import {Button} from '@salesforce/retail-react-app/app/components/shared/ui'
import {
    useProducts,
    useCustomerId,
    useShopperCustomersMutation
} from '@salesforce/commerce-sdk-react'

import {useToast} from '@salesforce/retail-react-app/app/hooks/use-toast'

import {
    API_ERROR_MESSAGE,
    TOAST_ACTION_VIEW_WISHLIST,
    TOAST_MESSAGE_ADDED_TO_WISHLIST,
    TOAST_MESSAGE_REMOVED_FROM_WISHLIST
} from '@salesforce/retail-react-app/app/constants'

import {useWishList} from '@salesforce/retail-react-app/app/hooks/use-wish-list'
import useNavigation from '@salesforce/retail-react-app/app/hooks/use-navigation'

// THIS IS A HACKY FUNCTION
import convertUseProductsToUseProductSearchFormat from '~/builder/utils/convertUseProductsToUseProductSearchFormat'

const ProductsProvider = ({productIds, children}) => {
    const {formatMessage} = useIntl()
    const toast = useToast()
    const navigate = useNavigation()

    const {data: products, isLoading: isProductsLoading} = useProducts(
        {parameters: {ids: productIds, allImages: true}},
        {enabled: productIds?.length > 0}
    )

    const convertedProducts = useMemo(() => {
        return products?.data?.map(convertUseProductsToUseProductSearchFormat)
    }, [products])

    const customerId = useCustomerId()
    const [wishlistLoading, setWishlistLoading] = useState([])
    const {mutateAsync: createCustomerProductListItem} = useShopperCustomersMutation(
        'createCustomerProductListItem'
    )
    const {mutateAsync: deleteCustomerProductListItem} = useShopperCustomersMutation(
        'deleteCustomerProductListItem'
    )

    /**************** Action Handlers ****************/
    const {data: wishlist, isLoading: isWishlistLoading} = useWishList()
    const addItemToWishlist = async (product) => {
        setWishlistLoading([...wishlistLoading, product.productId])

        // TODO: This wishlist object is from an old API, we need to replace it with the new one.
        const listId = wishlist.id
        await createCustomerProductListItem(
            {
                parameters: {customerId, listId},
                body: {
                    quantity: 1,
                    public: false,
                    priority: 1,
                    type: 'product',
                    productId: product.productId
                }
            },
            {
                onError: () => {
                    toast({
                        title: formatMessage(API_ERROR_MESSAGE),
                        status: 'error'
                    })
                },
                onSuccess: () => {
                    toast({
                        title: formatMessage(TOAST_MESSAGE_ADDED_TO_WISHLIST, {quantity: 1}),
                        status: 'success',
                        action: (
                            // it would be better if we could use <Button as={Link}>
                            // but unfortunately the Link component is not compatible
                            // with Chakra Toast, since the ToastManager is rendered via portal
                            // and the toast doesn't have access to intl provider, which is a
                            // requirement of the Link component.
                            <Button variant="link" onClick={() => navigate('/account/wishlist')}>
                                {formatMessage(TOAST_ACTION_VIEW_WISHLIST)}
                            </Button>
                        )
                    })
                },
                onSettled: () => {
                    setWishlistLoading(wishlistLoading.filter((id) => id !== product.productId))
                }
            }
        )
    }

    const removeItemFromWishlist = async (product) => {
        setWishlistLoading([...wishlistLoading, product.productId])

        const listId = wishlist.id
        const itemId = wishlist.customerProductListItems.find(
            (i) => i.productId === product.productId
        ).id

        await deleteCustomerProductListItem(
            {
                parameters: {customerId, listId, itemId}
            },
            {
                onError: () => {
                    toast({
                        title: formatMessage(API_ERROR_MESSAGE),
                        status: 'error'
                    })
                },
                onSuccess: () => {
                    toast({
                        title: formatMessage(TOAST_MESSAGE_REMOVED_FROM_WISHLIST),
                        status: 'success'
                    })
                },
                onSettled: () => {
                    setWishlistLoading(wishlistLoading.filter((id) => id !== product.productId))
                }
            }
        )
    }

    const isLoading = isProductsLoading || isWishlistLoading

    return children({
        isLoading,
        productIds,
        products: convertedProducts,
        wishlist,
        addItemToWishlist,
        removeItemFromWishlist
    })
}

ProductsProvider.propTypes = {
    productIds: PropTypes.any,
    children: PropTypes.func
}

export default ProductsProvider
