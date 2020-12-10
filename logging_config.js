/* eslint-disable no-unused-vars, no-var */
const logLevel = process.env.REACT_APP_JIFMEET_LOG ? 'info' : 'error';

// Logging configuration
var loggingConfig = {
    // default log level for the app and lib-jitsi-meet
    defaultLogLevel: logLevel,

    // Option to disable LogCollector (which stores the logs on CallStats)
    disableLogCollector: true,

    // The following are too verbose in their logging with the
    // {@link #defaultLogLevel}:
    'modules/RTC/TraceablePeerConnection.js': logLevel,
    'modules/statistics/CallStats.js': logLevel,
    'modules/xmpp/strophe.util.js': logLevel,
    'modules/xmpp/xmpp.js': logLevel,
    'modules/xmpp/strophe.ping.js': logLevel,
    'modules/xmpp/ChatRoom.js': logLevel,
    'modules/xmpp/XmppConnection.js': logLevel,
    'modules/version/ComponentsVersions.js': logLevel,
    'modules/xmpp/moderator.js': logLevel,
    'modules/remotecontrol/RemoteControl.js': logLevel,
    'modules/UI/videolayout/LargeVideoManager.js': logLevel,
    'modules/RTC/RTCUtils.js': logLevel,
    'modules/browser/BrowserCapabilities.js': logLevel,
    'modules/e2eping/e2eping.js': logLevel,
    'modules/connectivity/ParticipantConnectionStatus.js': logLevel,
    'modules/statistics/AvgRTPStatsReporter.js': logLevel,
    'modules/UI/videolayout/SmallVideo.js': logLevel,
    'modules/xmpp/JingleSessionPC.js': logLevel,
    'modules/UI/videolayout/VideoLayout.js': logLevel,
    'modules/RTC/BridgeChannel.js': logLevel,
    'modules/RTC/RTC.js': logLevel,
    'modules/xmpp/SDPUtil.js': logLevel,
    'modules/xmpp/strophe.jingle.js': logLevel,
    'modules/xmpp/SdpConsistency.js': logLevel,
    'JitsiConferenceEventManager.js': logLevel,
    'features/base/tracks': logLevel,
    'features/video-quality': logLevel,
    'features/base/media': logLevel,
    'features/base/redux': logLevel,
    'features/analytics': logLevel,
    'conference.js': logLevel,
    'JitsiConference.js': logLevel,
    'JitsiParticipant.js': logLevel,
    'index.web': logLevel
};

/* eslint-enable no-unused-vars, no-var */

// XXX Web/React server-includes logging_config.js into index.html.
// Mobile/react-native requires it in react/features/base/logging. For the
// purposes of the latter, (try to) export loggingConfig. The following
// detection of a module system is inspired by webpack.
typeof module === 'object'
    && typeof exports === 'object'
    && (module.exports = loggingConfig);
