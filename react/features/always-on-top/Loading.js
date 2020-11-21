import React from 'react';

import {
    Icon,
    IconLogo
} from '../base/icons';

function Loading(props) {
    return (
        <div className="waiting-display-overlay">
            <Icon src = { IconLogo } size={120}/> 
            {/*<img src={"images/loading_colored.gif"} />*/}
        </div>
    )
}

export default Loading;