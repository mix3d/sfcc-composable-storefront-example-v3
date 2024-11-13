import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '@salesforce/retail-react-app/app/components/shared/ui'
import {Blocks, isPreviewing} from '@builder.io/sdk-react'

const ButtonWrapper = (props) => {
    const {text, useText, children, builderBlock, ...restProps} = props
    return (
        <Button {...restProps}>
            {useText
                ? text
                : (isPreviewing() || children) && (
                      <Blocks
                          parent={builderBlock?.id}
                          path={`component.options.content`}
                          blocks={children}
                      ></Blocks>
                  )}
        </Button>
    )
}

ButtonWrapper.propTypes = {
    useText: PropTypes.bool.isRequired,
    text: PropTypes.string,
    content: PropTypes.object,
    builderBlock: PropTypes.shape({
        id: PropTypes.string.isRequired
    })
}

// If you want Builder styles to work with the ChakraButton, we recommend leaving noWrap: false,
// Otherwise without changes to the Chakra/Emotion system during SSR, you will get flashes of styles.
// The main downside is the wrapper div Builder's SDK will add. See the README.md for more details
export const ButtonDefinition = {
    component: ButtonWrapper,
    name: 'ChakraButton',
    noWrap: false,
    canHaveChildren: true,
    // To receieve Builder props inside your custom component: by default false
    shouldReceiveBuilderProps: {
        // To access Builder's Blocks relative to your parent
        builderBlock: true
    },
    inputs: [
        {
            name: 'useText',
            type: 'boolean',
            defaultValue: false,
            helperText:
                'Use text input for Button Value. If false, uses Builder children for button content',
            onChange: (options) => {
                if (options.get('useText')) {
                    options.set('content', null)
                } else {
                    options.set('text', '')
                }
            }
        },
        {
            name: 'text',
            type: 'string',
            showIf: function (options) {
                return options.get('useText') === true
            }
        }
        // {
        //     name: 'content',
        //     friendlyName: 'Children',
        //     type: 'uiBlocks'
        //     // showIf: (options) => options.get('useText') === false
        // }
    ],
    defaultChildren: [
        {
            '@type': '@builder.io/sdk:Element',
            component: {name: 'Text', options: {text: 'I am child text block!'}}
        }
    ]
}
