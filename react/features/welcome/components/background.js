import React, {Component} from 'react';
import { Watermarks } from '../../base/react';

class Background extends Component {
    render() {
        return (
            <>
                <div className='welcome-page-background left-bg'></div>
                <div className='welcome-page-background right-bg'></div>

                <div className = 'welcome-watermark'>
                    <Watermarks />
                </div>
            </>
        )
    }
}
export default Background