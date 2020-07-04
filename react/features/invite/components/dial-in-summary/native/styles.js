// @flow

import { ColorPalette } from '../../../../base/styles';

export const INDICATOR_COLOR = ColorPalette.lightGrey;

const WV_BACKGROUND = '#242424';

export default {

    backDrop: {
        backgroundColor: WV_BACKGROUND
    },

    indicatorWrapper: {
        alignItems: 'center',
        backgroundColor: ColorPalette.white,
        height: '100%',
        justifyContent: 'center'
    },

    webView: {
        backgroundColor: WV_BACKGROUND,
        flex: 1
    }
};
