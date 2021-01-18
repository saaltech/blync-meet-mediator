import React from 'react';
import { translate } from '../i18n';

function HeaderSection(props) {
    const { children = null, headerClass = '' } = props;
    return (
        <div className={`header-section ${headerClass}`}>
            <div>
                {children}
            </div>
        </div>
    )
}

export default translate(HeaderSection);