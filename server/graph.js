var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();
    return user;
  },
  getCalenderView: async function(accessToken, start, end, timeZone) {
    const client = getAuthenticatedClient(accessToken);

    const events = await client
    .api('/me/calenderview')
    .header("Prefer", `outlook.timezone="${timeZone}"`)
    .query({startDateTime: start, endDateTime: end})
    .select('subject,organizer,start,end')
    .orderby('start/dateTime')
    .top(50)
    .get();

    return events;
  },
};

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}