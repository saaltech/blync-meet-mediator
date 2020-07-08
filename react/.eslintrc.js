module.exports = {
    'extends': [
        '../.eslintrc.js',
        'eslint-config-jitsi/jsdoc',
        'eslint-config-jitsi/react',
        '.eslintrc-react-native.js'
    ],
    'rules': {
        'react/jsx-no-bind': 0,
        'react-native/no-inline-styles': 0,
        'max-len': [
            2,
            150,
            4
        ]
    }
};
