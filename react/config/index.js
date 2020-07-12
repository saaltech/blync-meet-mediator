export const config = {};

config.unauthenticatedIRP =
  process.env.REACT_APP_ENV === "prod" ? "/irp" : "/irp";
config.authenticatedIRP =
  process.env.REACT_APP_ENV === "prod" ? "/authenticate-irp" : "/authenticate-irp";
config.conferenceManager =
  process.env.REACT_APP_ENV === "prod" ? "/blync-mgmt" : "/blync-mgmt";

// ==== blync-mgmt Endpoints ====
//
config.conferenceEP = "/auth/api/v1/conferences"
config.unauthConferenceEP = "/unauth/api/v1/conferences"
config.verifySecretEP = "/unauth/api/v1/conferences/validatesecret"
config.jidEP = "/auth/api/v1/jid"

// IRP Endpoints
config.signInEP = '/api/users/sign-in'
