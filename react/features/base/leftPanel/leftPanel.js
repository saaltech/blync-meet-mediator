import React from 'react';
import { IconContext } from 'react-icons';
import { RiContactsBookFill, RiVideoChatFill, RiVideoAddLine } from 'react-icons/ri';
import TncPrivacy from '../../welcome/components/TncPrivacy';


export default function LeftPanel(props) {
    const { interfaceConfig = {}, activeButton = 'join', setActiveButton } = props;

    function handleClickIcon(value) {
        setActiveButton(value);
    }
    function _renderLogo() {
        let reactElement = null;

        const style = {
            position: 'fixed',
            top: '10px',
            backgroundImage: `url(${interfaceConfig.LOGO_WITH_BOTTOM_LABEL_URL || '../images/logo_bottom_label.png'})`
        };

        reactElement = (<div
            className='left-logo'
            style={style} />);

        return reactElement;
    }

    function renderButton() {
        let reactElement = null;

        reactElement = (
            <div>
                <IconContext.Provider value={{
                    style: {
                        cursor: 'pointer',
                        color: activeButton === 'contacts' ? 'green' : 'blue'
                    }
                }}>
                    <div onClick={() => { handleClickIcon('contacts') }}
                        style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <RiContactsBookFill size={40} />
                        <div style={{ color: activeButton === 'contacts' ? 'green' : 'blue' }}>
                            Contacts
                        </div>
                    </div>
                </IconContext.Provider>
                <IconContext.Provider value={{
                    style: {
                        cursor: 'pointer',
                        color: activeButton === 'join' ? 'green' : 'blue'
                    }
                }}>
                    <div
                        onClick={() => { handleClickIcon('join') }}
                        style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <RiVideoChatFill size={40} />
                        <div style={{ color: activeButton === 'join' ? 'green' : 'blue' }}>
                            Join
                        </div>
                    </div>
                </IconContext.Provider>
                <IconContext.Provider value={{
                    style: {
                        cursor: 'pointer',
                        color: activeButton === 'create' ? 'green' : 'blue'
                    }
                }}>
                    <div
                        onClick={() => { handleClickIcon('create') }}
                        style={{ textAlign: 'center' }}>
                        <RiVideoAddLine size={40} />
                        <div style={{ color: activeButton === 'create' ? 'green' : 'blue' }}>
                            Create
                        </div>
                    </div>
                </IconContext.Provider>

            </div>);

        return reactElement;
    }

    /**
     * Renders a Jifmeet terms and conditions and privacy section.
     *
     * @private
     * @returns {ReactElement|null}
     */
    function _renderPrivacySection() {
        let reactElement = null;

        reactElement = (<TncPrivacy />);

        return reactElement;
    }

    return (
        <div className='left-header'>
            {
                _renderLogo()
            }
            {
                renderButton()
            }
            {
                _renderPrivacySection()
            }
        </div>
    )
}