export const config = {};

// TODO: change this value to dev or something  else for local development
process.env.REACT_APP_ENV = "prod"
config.unauthenticatedIRP =
  process.env.REACT_APP_ENV === "prod" ? "/irp" : "";
config.authenticatedIRP =
  process.env.REACT_APP_ENV === "prod" ? "/authenticate-irp" : "";
config.conferenceManager =
  process.env.REACT_APP_ENV === "prod" ? "/blync-mgmt" : "";

// ==== blync-mgmt Endpoints ====
//
config.conferenceEP = "/auth/api/v1/conferences"
config.unauthConferenceEP = "/unauth/api/v1/conferences"
config.verifySecretEP = "/unauth/api/v1/conferences/validatesecret"
config.jidEP = "/auth/api/v1/jid"
config.unauthParticipantsEP = "/unauth/api/v1/participants"
config.authParticipantsEP = "/auth/api/v1/participants"

// IRP Endpoints
config.signInEP = '/api/users/sign-in'
config.refreshToken = '/api/users/accesstoken/refresh'
