
/* Check User inputs */
export default function validateUser(values) {

    const errors = {};

    if (!values.email) {
        errors.email = "Enter An Email";
    }

    if (!values.password) {
        errors.password = "Enter A Password";
    }

    if (!values.firstName) {
        errors.firstName = "Enter A First Name";
    }

    if (!values.lastName) {
        errors.lastName = "Enter A Last Name";
    }

    return errors;
}
