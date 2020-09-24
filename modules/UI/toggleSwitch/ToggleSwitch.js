/* @flow */

import React, { useState, useEffect } from 'react';

import { resolveAppLogin } from '../../../react/features/app-auth/actions';
import { translate } from '../../../react/features/base/i18n';
import { connect } from '../../../react/features/base/redux';

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

    /*
        $('li').click(function() {
            $("li").removeClass("active") DONE
            $(this).addClass("active") DONE
            $('#slider').removeClass('slider__0') DONE
            $('#slider').removeClass('slider__1') DONE
            $('#slider').addClass('slider__'+$(this).data('i')); DONE
        })
    */

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
                {

                    /*
                    <li data-i="0" class="active start">Start</li>
                    <li class="join" data-i="1">Join</li>
                    */

                }
            </ul>
            <div className="sliderBack">

            </div>
            <div id="slider" className={`slider slider__${localActiveIndex}`}>

            </div>
        </div>
    );
}

/**
 * Ties up to redux state changes
 *
 */
function _mapStateToProps(state: Object) {
    return {
        // googleOfflineCode: state['features/app-auth'].googleOfflineCode
    };
}

export default translate(connect(_mapStateToProps)(ToggleSwitch));
