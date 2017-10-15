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
const ADMIN_PLAYS = `/${ADMIN}/${PLAY}`;
const ADMIN_SPECIFIC_PLAY = `/${ADMIN}/${PLAY}/${ID}`
const ADMIN_POST_PLAY = `/${ADMIN}/${PLAY}/${NEW}`;
const ADMIN_POST_MANY_PLAYS = `/${ADMIN}/${PLAY}/${MULT_NEW}`;
const ADMIN_USERS = `/${ADMIN}/${USER}`;
const ADMIN_SPECIFIC_USER = `/${ADMIN}/${USER}/${ID}`;
const ADMIN_POST_USER = `/${ADMIN}/${USER}/${NEW}`;
const ADMIN_POST_MANY_USERS = `/${ADMIN}/${USER}/${MULT_NEW}`;
export { ADMIN_LOGIN, ADMIN_PLAYS, ADMIN_SPECIFIC_PLAY, ADMIN_POST_PLAY,
            ADMIN_POST_MANY_PLAYS, ADMIN_USERS, ADMIN_SPECIFIC_USER,
            ADMIN_POST_USER, ADMIN_POST_MANY_USERS }

const USER_LOGIN = `/${STUDENT}/${LOGIN}`;
const USER_PLAYS = `/${STUDENT}/${PLAY}`;
const USER_SPECIFIC_PLAY = `/${STUDENT}/${PLAY}/${ID}`
export { USER_LOGIN, USER_PLAYS, USER_SPECIFIC_PLAY };
