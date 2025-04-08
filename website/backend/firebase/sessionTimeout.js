let sessionTimeout;

export function startSessionTimeout(auth) {
  clearTimeout(sessionTimeout);
  sessionTimeout = setTimeout(() => {
    alert("Session expired. Please log in again.");
    auth.signOut().then(() => {
      window.location.href = "../login/index.html";
    });
  }, 10 * 1000); // For testing: 10 seconds
}

export function setupAutoReset(auth) {
  ['click', 'mousemove', 'keypress'].forEach(event => {
    document.addEventListener(event, () => {
      if (auth.currentUser) {
        startSessionTimeout(auth);
      }
    });
  });
}