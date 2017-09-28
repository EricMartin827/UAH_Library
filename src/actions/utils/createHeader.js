export default function createHeader(access, token) {

    if (access == "user") {
        return {
            headers : {"x-user" : token }
        };
    }

    return {
        headers : {"x-admin" : token }
    };
}
