// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  dash: path(ROOTS_DASHBOARD, '/dash'), 
  device: (deviceName) => path(ROOTS_DASHBOARD, `/${deviceName}/pour`),
  profile: path(ROOTS_DASHBOARD, '/profile'),

  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    admin: path(ROOTS_DASHBOARD, '/user/admin'),
    edit: (uid) => path(ROOTS_DASHBOARD, `/user/${uid}/edit`),
  },
};
