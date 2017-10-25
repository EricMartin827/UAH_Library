const ADMIN = "admin";
const STUDENT = "student";
const LOGIN = "login";
const USER = "users";
const PLAY = "plays";
const MULT_NEW = "mnew";
const NEW = "new";
const ID = ":id"

const ROOT = "/";
const REGISTER = "/register";
export { ROOT, REGISTER };

const ADMIN_LOGIN = `/${ADMIN}/${LOGIN}`;
const ADMIN_PLAY = `/${ADMIN}/${PLAY}`;
const ADMIN_POST_PLAY = `/${ADMIN}/${PLAY}/${NEW}`;
const ADMIN_POST_MANY_PLAYS = `/${ADMIN}/${PLAY}/${MULT_NEW}`;
const ADMIN_USER = `/${ADMIN}/${USER}`;
const ADMIN_POST_USER = `/${ADMIN}/${USER}/${NEW}`;
const ADMIN_POST_MANY_USERS = `/${ADMIN}/${USER}/${MULT_NEW}`;
export { ADMIN_LOGIN, ADMIN_PLAY, ADMIN_POST_PLAY,
            ADMIN_POST_MANY_PLAYS, ADMIN_USER, ADMIN_POST_USER,
            ADMIN_POST_MANY_USERS };

const USER_LOGIN = `/${STUDENT}/${LOGIN}`;
const USER_PLAY = `/${STUDENT}/${PLAY}`;
export { USER_LOGIN, USER_PLAY };
