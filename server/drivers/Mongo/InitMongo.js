/**
 * The InitMongo.js file is a configuration file used to create and set the
 * the properties of MongoDB Collections. It should be loaded and excecuted in
 * a server environement prior to deployment to ensure errors such as dupicate
 * database entries are not generated for the UAH Library. This ensures
 * that there will never be multiple records describing the same entity such
 * as a student, a falculty member, a play, etc..
 *
 * @author Eric William Martin
 */

var db = connect("127.0.0.1:27017/UAH_LIBRARY");

db.createCollection("plays");

db.plays.ensureIndex(
    {title: 1, authorLast: 1, authorFirst: 1},
    {unique: true}
);
