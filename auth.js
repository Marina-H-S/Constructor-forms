auth = (function(){
  return {
    getRoles: getRoles,
    isInRole: isInRole,
    getUserId: getUserId
  };

  function isInRole(role){
    return getRoles()&&getRoles().indexOf(role)!=-1;
  };

  function getRoles(){
    var idToken = localStorage.getItem('id_token');
    var payload = parseJwt(idToken);
    var roles = payload['http://constructor-forms/roles'];
    return roles;
  };

  function getUserId(){
    var idToken = localStorage.getItem('id_token');
    var payload = parseJwt(idToken);
    var id = payload['sub'];
    return id;
  };

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

})();

window.addEventListener('load', function() {
  
    var webAuth = new auth0.WebAuth({
        domain: 'tinilit.eu.auth0.com',
        clientID: 'ms0ON7Ldvs7y19NIKEqSyty9DqrBpaHa',
        responseType: 'token id_token',
        audience: 'https://tinilit.eu.auth0.com/userinfo',
        scope: 'openid',
        redirectUri: window.location.href
    });


  
    // buttons and event listeners
    var loginBtn = document.getElementById('btn-login');
    var logoutBtn = document.getElementById('btn-logout');
  
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        webAuth.authorize();
      });
      
    logoutBtn.addEventListener('click', logout);
  
    function handleAuthentication() {
      webAuth.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          setSession(authResult);
          loginBtn.style.display = 'none';
        } else if (err) {
          console.log(err);
          alert(
            'Error: ' + err.error + '. Check the console for further details.'
          );
        }
        displayButtons();
      });
    }
  
    function setSession(authResult) {
      // Set the time that the Access Token will expire at
      var expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }
    
  
    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      displayButtons();
      window.location.reload();
    }
  
    function isAuthenticated() {
      // Check whether the current time is past the
      // Access Token's expiry time
      var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }
  
    function displayButtons() {
      if (isAuthenticated()) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
      } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
      }
    }

    handleAuthentication();
  });