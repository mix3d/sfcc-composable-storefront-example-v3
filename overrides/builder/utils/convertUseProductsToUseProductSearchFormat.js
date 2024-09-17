// the useProducts hook returns an array of products in a different format than the useProductSearch hook
// this function attempts to map the useProducts format to the useProductSearch format, to work with the ProductTile component.
// STRONGLY encourage looking for a better way to do this!
export default function convertUseProductsToUseProductSearchFormat(product) {
    const largeImage =
        product.imageGroups.find((group) => group.viewType === 'large')?.images[0] || {}

    return {
        currency: product.currency,
        image: {
            alt: largeImage.title ?? largeImage.alt ?? '',
            disBaseLink: largeImage.disBaseLink ?? '',
            link: largeImage.link ?? '',
            title: largeImage.title ?? ''
        },
        price: product.price,
        productId: product.id,
        hitType: product.type.master ? 'master' : 'variant',
        name: product.name,
        productName: product.name
    }
}
