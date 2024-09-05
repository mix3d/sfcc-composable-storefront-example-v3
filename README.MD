# Builder.io integrated with Composable Storefront v3 Template 

Welcome to the Builder-integrated PWA Kit example project! 

This repository should serve as an example of how to integrate Builder.io's Visual CMS with Salesforce's Composable Storefront / PWAKit platform. There should be little added on top of the base Composable reference storefront, making integration with an existing site quick and easy.

This approach is also compatible without Template Overrides, everything inside overrides folder will match a full exit PWAKit project, but Overrides was chosen to reduce the noise for this example.

Note: This project serves as an integration example, and is not an officially supported project starter.


### Notable Changes to PWAKit
-  Builder space API key stored in the `/config/[site].js` files
-  Patch file to modify approved domain in the iframe allow-list in `commerce-sdk-react`
   -  Necessary due to the MRT preview mode that assumes all iframes are preview mode.
-  `ssr.js` additions to Content Security Policy (CSP) to enable Builder support.
-  Webpack config changes to add an `alias` for `~/path/to/file` handling (so you don't need to do deeply nested relative imports like `../../../path/to/file`), and supports importing/requiring CSS files (not required for Builder support but common usecase that PWAKit doesn't handle OOB).

### Builder Content Areas
-  Page route overrides that include Builder content areas
   -  Homepage
   -  Marketing pages
   -  Blog pages
   -  PLP
   -  PDP
-  Global Header slots
-  Custom Components:
   -  Einstein recommenders
   -  Blog content
   -  PDP Product wrapper
-  Example Builder insert menu registration in `_app-config` wrapper override
-  Recommended Content Fetching patterns in `builder/hooks/fetchWrappers.js`

TODO: Build examples for
- SEO from Builder on pages
- Datamodel driven Nav menu, footer
- Merchandize nav menu area
- PLP list tile Content insertion
- More Product Components
- Localization examples
  - Page Level
  - Field Level
- Design Tokens leveraging Chakra's template styles 
- Convert example to Typescript
- Aligning Chakra's Mobile-first breakpoints with Builder's defined breakpoints

### 🚨 Important Notes about this Example Implementation

Due to an issue with PWAKit's SDKs, it is necessary to patch the SDK to support running the project in an iframe, which is how Builder's CMS loads the visual preview in the editor. See [this Community PWAKit POC repo](https://github.com/SalesforceCommerceCloud/composable-storefront-pocs/tree/main) and this thread in the [Unofficial SFCC Slack channel](https://sfcc-unofficial.slack.com/archives/C02KUCHDEKH/p1717452731269259) for more details, the Patch file is attributed to the hard work of others.

**Additional Caveats:**
- PWAKit uses ChakraUI, which in turn leverages Emotion's CSS library. There is an odd behavior with Emotion during SSR that places the CSS classes adjacent to the Chakra component *during SSR*, but moves them to the `<head>` during Hydration / Client-side Rendering. The impact when joined with Builder is that Builder will also place CSS styles adjacent to the component. Because Builder wraps Custom Components by default, this usually isn't an issue, but when combined with the `noWrap: true` option, Chakra's component styles will have specificity over Builder's styles *during* SSR (they are placed lower in the DOM), but post-hydration Builder's styles have specificity (Chakra styles moved to `<head>`). This can cause flashes of style/CLS issues. We recommend leaving `noWrap` to it's default `false` value when registering styled Chakra components as Custom Components.  

## Getting Started

### Requirements

- Node 18 or later
- npm 9 or later
- [Salesforce Commerce API Public Client Id](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/setting-up-api-access.html)
  - The Builder <> SFCC Plugin only supports a Public TokenId at the time of writing. PWAkit can still be instantiated with a Private TokenId.
- [A Builder.io account](https://builder.io/signup)

### Run the Project Locally
Get your Builder API key from your space, and replace in the configs/default.js file.

```bash
npm install
npm start
```

This will open a browser and your storefront will be running on http://localhost:3000

Login https://builder.io to create and publish content. 


### Deploy to Managed Runtime

```
npm run push -- -m "Message to help you recognize this bundle"
```

**Note**: This command will push to the MRT project that matches the name field in `package.json`. To push to a different project, include the `-s` argument.

**Important**: Access to the [Runtime Admin](https://runtime.commercecloud.com/) application is required to deploy bundles. To learn more, read our guide to [Push and Deploy Bundles](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/pushing-and-deploying-bundles.html).

## Customizing the application

This version of the application uses [Template Extensibility](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/template-extensibility.html) to empower you to more easily customize base templates. Please refer to our documentation for more information.

## 🌍 Localization

See the [Localization README.md](./packages/template-retail-react-app/translations/README.md) for important setup instructions for app localization.

For CMS localization, read Builder's [documentation on localization patterns](https://www.builder.io/c/docs/localization-intro).

## 📖 Documentation

The full documentation for PWA Kit and Managed Runtime is hosted on the [Salesforce Developers](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/overview) portal.

## Further documentation

For more information on working with the PWA Kit, refer to:

-   [Get Started](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/getting-started.html)
-   [Skills for Success](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/skills-for-success.html)
-   [Set Up API Access](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/setting-up-api-access.html)
-   [Configuration Options](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/configuration-options.html)
-   [Proxy Requests](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/proxying-requests.html)
-   [Push and Deploy Bundles](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/pushing-and-deploying-bundles.html)
-   [The Retail React App](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/retail-react-app.html)
-   [Rendering](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/rendering.html)
-   [Routing](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/routing.html)
-   [Phased Headless Rollouts](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/phased-headless-rollouts.html)
-   [Launch Your Storefront](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/launching-your-storefront.html)
