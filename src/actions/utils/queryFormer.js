import qString from "query-string";

function toJSON(val) {
    if (isObject(val)) {
       for (var prop in val) {
           val[prop] = toJSON(val[prop])
       }
	   return JSON.stringify(val);
    }
    return val
}

export default function toQuery(obj) {

    if (isObject(obj)) {
        for (var prop in obj) {
            obj[prop] = toJSON(obj[prop])
        }
	return qString.stringify(obj);
    }
}
