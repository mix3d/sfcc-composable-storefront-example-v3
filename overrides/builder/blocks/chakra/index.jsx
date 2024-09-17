import React from 'react'
import {Button} from '@salesforce/retail-react-app/app/components/shared/ui'
import PropTypes from 'prop-types'
import {Blocks} from '@builder.io/sdk-react'

const ButtonWrapper = (props) => {
    console.log('ButtonWrapper props', props)
    const {text, useText, content, builderBlock, ...restProps} = props
    return (
        <Button {...restProps}>
            {useText ? (
                text
            ) : (
                <Blocks
                    parent={builderBlock.id}
                    path={`component.options.content`}
                    blocks={content}
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
    inputs: [
        {
            name: 'useText',
            type: 'boolean',
            defaultValue: true,
            helperText:
                'Use text input for Button Value. If false, uses Builder children for button content',
            onChange: (options) => {
                if (options.get('useText')) {
                    options.set('children', null)
                } else {
                    options.set('text', '')
                }
            }
        },
        {
            name: 'text',
            type: 'string',
            showIf: (options) => options.useText
        },
        {
            name: 'content',
            friendlyName: 'Children',
            type: 'uiBlocks',
            showIf: (options) => !options.useText
        }
    ]
}
