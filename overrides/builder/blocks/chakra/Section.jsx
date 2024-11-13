import React from 'react'
import PropTypes from 'prop-types'
import Section from '@salesforce/retail-react-app/app/components/section'
import {Blocks} from '@builder.io/sdk-react'

const SectionWrapper = (props) => {
    const {title, subtitle, actions, builderBlock, ...restProps} = props

    const actionsBlock = (
        <Blocks
            parent={builderBlock.id}
            path={`component.options.actions`}
            blocks={actions}
        ></Blocks>
    )
    return (
        <Section
            title={title}
            subtitle={<div dangerouslySetInnerHTML={{__html: subtitle}}></div>}
            actions={actionsBlock}
            {...restProps}
        />
    )
}

SectionWrapper.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.any,
    actions: PropTypes.any,
    builderBlock: PropTypes.shape({
        id: PropTypes.string.isRequired
    })
}

export const SectionDefinition = {
    component: Section,
    name: 'TitledSection',
    noWrap: false,
    canHaveChildren: true,
    inputs: [
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'subtitle',
            type: 'richText'
        },
        {
            name: 'actions',
            type: 'uiBlocks'
        }
    ]
}
