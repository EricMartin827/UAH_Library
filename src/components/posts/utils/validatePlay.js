
export default function validatePlay(values) {
    const errors = {};
    if (!values.title) {
            errors.title = "Enter A Title";
    }
    if (!values.genre) {
        errors.genre = "Enter A Genre";
    }
    if (!(values.actorCount - 0)) {
        errors.actorCount = "Enter Number of Actors";
    }
    if (!values.authorLast) {
        errors.authorLast = "Enter Author's Last Name";
    }
    if (!values.authorFirst) {
        errors.authorFirst = "Enter Author's First Name";
    }
    if (!values.timePeriod) {
        errors.timePeriod = "Enter time period";
    }
    if (!(values.costumeCount - 0)) {
        errors.costumeCount = "Enter Number of Costumes";
    }
    if (!values.hasSpectacle) {
        errors.hasSpectacle = "Enter spectacle name or 'false'"
    }
    if (!(values.copies - 0)) {
        errors.copies = "Enter Number of Copies of Script"
    }
    return errors;
}
