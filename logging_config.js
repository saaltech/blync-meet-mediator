/* eslint-disable no-unused-vars, no-var */

// Logging configuration
var loggingConfig = {
    // default log level for the app and lib-jitsi-meet
    defaultLogLevel: 'error',

    // Option to disable LogCollector (which stores the logs on CallStats)
    disableLogCollector: true,

    // The following are too verbose in their logging with the
    // {@link #defaultLogLevel}:
    'modules/RTC/TraceablePeerConnection.js': 'error',
    'modules/statistics/CallStats.js': 'error',
    'modules/xmpp/strophe.util.js': 'error',
    'modules/xmpp/xmpp.js': 'error',
    'modules/xmpp/strophe.ping.js': 'error',
    'modules/xmpp/ChatRoom.js': 'error',
    'modules/xmpp/XmppConnection.js': 'error',
    'modules/version/ComponentsVersions.js': 'error',
    'modules/xmpp/moderator.js': 'error',
    'modules/remotecontrol/RemoteControl.js': 'error',
    'modules/UI/videolayout/LargeVideoManager.js': 'error',
    'modules/RTC/RTCUtils.js': 'error',
    'modules/browser/BrowserCapabilities.js': 'error',
    'modules/e2eping/e2eping.js': 'error',
    'modules/connectivity/ParticipantConnectionStatus.js': 'error',
    'modules/statistics/AvgRTPStatsReporter.js': 'error',
    'modules/UI/videolayout/SmallVideo.js': 'error',
    'modules/xmpp/JingleSessionPC.js': 'error',
    'modules/UI/videolayout/VideoLayout.js': 'error',
    'modules/RTC/BridgeChannel.js': 'error',
    'modules/RTC/RTC.js': 'error',
    'modules/xmpp/SDPUtil.js': 'error',
    'modules/xmpp/strophe.jingle.js': 'error',
    'modules/xmpp/SdpConsistency.js': 'error',
    'JitsiConferenceEventManager.js': 'error',
    'features/base/tracks': 'error',
    'features/video-quality': 'error',
    'features/base/media': 'error',
    'features/base/redux': 'error',
    'features/analytics': 'error',
    'conference.js': 'error',
    'JitsiConference.js': 'error',
    'JitsiParticipant.js': 'error',
    'index.web': 'error'
};

/* eslint-enable no-unused-vars, no-var */

// XXX Web/React server-includes logging_config.js into index.html.
// Mobile/react-native requires it in react/features/base/logging. For the
// purposes of the latter, (try to) export loggingConfig. The following
// detection of a module system is inspired by webpack.
typeof module === 'object'
    && typeof exports === 'object'
    && (module.exports = loggingConfig);
