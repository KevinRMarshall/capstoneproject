//require graph to make api requests to microsoft graph
const graph = require('../graph');
//for microsoft authentication
const msal = require('@azure/msal-node');
//for our async calls
const router = require('express-promise-router')();
//user model
const User = require('../db/schemas/userSchema');
const Profile = require('../db/schemas/profileSchema');
const { request } = require('../app');

const baseUrl = process.env.API_BASE_URL;


//variables for microsoft OAUTH2 graph api
const config = {
    auth: {
        clientId: process.env.OAUTH_APP_ID,
        authority: process.env.OAUTH_AUTHORITY,
        clientSecret: process.env.OAUTH_APP_SECRET
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Create msal application object
const pca = new msal.ConfidentialClientApplication(config);


router.get('/login', async (req, res) => {
    const urlParameters = {
      scopes: process.env.OAUTH_SCOPES.split(','),
      redirectUri: process.env.OAUTH_REDIRECT_URI
    };

    try {
      // get url to sign user in and consent to scopes needed for application
      const authUrl = await pca.getAuthCodeUrl(urlParameters);
      res.redirect(authUrl);
    }
    catch (error) {
      console.log(`Error: ${error}`);
      res.redirect(baseUrl + 'login');
    }
});

router.get('/callback', async (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: process.env.OAUTH_SCOPES.split(','),
        redirectUri: process.env.OAUTH_REDIRECT_URI,
    };
    var existingUser = false;
    try {
      const response = await pca.acquireTokenByCode(tokenRequest);
      
      //set user id in our session
      req.session.userId = response.account.homeAccountId;
      //get user details from microsoft
      const user = await graph.getUserDetails(response.accessToken);

      
      //checking if user already exists, to either update token or add user
      if(await User.User.exists({ id: response.account.homeAccountId })) {
          await User.User.updateOne({token: response.accessToken});
          existingUser = true;
      } else {
        var name = [];
        if(user.displayName != null && user.displayName != "") {
          name = user.displayName.split(" ", 2);
        }
        var userToAdd = new User.User({
          id: response.account.homeAccountId,
          email: user.userPrincipalName,
          token: response.accessToken,
          firstName: name[0] || '',
          lastName: name[1] || '',
          });
        userToAdd.save((err) => {
          if(err) return console.log(err);
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }

    if(existingUser) {
        //FOR EXISTING USERS: redirect to home with userId in query to save to local storage and get their profile too
        Profile.getProfile(req.session.userId, function(err, prof) {
          if(err) {
            res.send(500, `Error: ${err}`);
          } else if(prof === null) {
            //FOR NEW USERS: redirect to our front to profile with userId in query to save to local storage
            res.redirect(`${baseUrl}profile?loggedUserId=${req.session.userId}`);
          } else {
            res.redirect(`${baseUrl}home?loggedUserId=${req.session.userId}&loggedProgramId=${prof.program}`); 
          }
        });
      }
});

router.get('/logout',
  async function(req, res) {
    // Sign out
    if (req.session.userId) {
      // Look up the user's account in the cache
      const accounts = await pca
        .getTokenCache()
        .getAllAccounts();

      const userAccount = accounts.find(a => a.homeAccountId === req.session.userId);

      // Remove the account
      if (userAccount) {
        pca
          .getTokenCache()
          .removeAccount(userAccount);
      }
    }

    // Destroy the user's session
    req.session.destroy(function (err) {
      res.redirect(baseUrl +'login');
    });
  }
);

router.get('/user', (req, res) => {
  profile = true;
    User.getUser(req.query.userId, function(err, user){
      if(err) {
        res.send(500, `Error: ${err}`);
      } else {
        Profile.getProfile(req.query.userId, function(err, prof) {
          if(err) {
            res.send(500, `Error: ${err}`);
          }
          else {
            if(prof == null) {
              profile = false;
            }
            if(user) {
              var display = (user.firstName != null && user.firstName != '') ? (user.firstName + ' ' + user.lastName) : (user.email);
              if(prof != null) {
                res.json({
                  'display': display,
                  'program': prof.program,
                  'isAdmin': user.isAdmin,
                  'profile': profile
                });
              } else {
                res.json({
                  'display': display
                });
              }
            } else {
              res.status(500).json({'error': 'User not found'});
            }
          }
        })
      }
    })
});

module.exports = router;