// Expose logout to force logout upon expired refresh token
let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

export const triggerLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  }
};