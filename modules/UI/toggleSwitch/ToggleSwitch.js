/* @flow */

import React, { useState, useEffect } from 'react';

const DEFAULT_ITEMS = {
    0: {
        name: 'ON',
        disabled: false
    },
    1: {
        name: 'OFF',
        disabled: false
    }
};

/**
 * Displays the toggle switch with the passed options
 *
 */
function ToggleSwitch(props) {
    const [ localActiveIndex = 0, setLocalActiveIndex ] = useState('');

    const { items = DEFAULT_ITEMS, toggleAction, containerStyle = {} } = props;

    useEffect(() => {
        if (props.activeIndex > -1) {
            setLocalActiveIndex(props.activeIndex);
        }
    }, [ props.activeIndex ]);

    const _toggleAction = index => {
        setLocalActiveIndex(index);
        toggleAction && toggleAction(index);
    };

    return (
        <div className="sliderC" style={ containerStyle }>
            <ul>
                {
                    Object.keys(items).map(indexKey =>
                        <li
                            onClick={() => !items[indexKey].disabled && _toggleAction(indexKey)}
                            data-i={indexKey}
                            className={`${parseInt(localActiveIndex, 10) === parseInt(indexKey, 10) && 'active'}
                                 item_${indexKey} ${items[indexKey].disabled && 'disabled'}`}
                            key={`item_${indexKey}`}>
                            {items[indexKey].name}
                            {items[indexKey].noPrivilegeTip}
                        </li>
                    )
                }
            </ul>
            <div className="sliderBack">

            </div>
            <div id="slider" className={`slider slider__${localActiveIndex}`}>

            </div>
        </div>
    );
}

export default ToggleSwitch;
