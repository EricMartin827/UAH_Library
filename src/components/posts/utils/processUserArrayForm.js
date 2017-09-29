import _ from "lodash";

export default function processUserArrayForm(values) {

    const array = [{}];
    let count = 0;
    let val;
    for (var key in values) {

        if (key.match(count)) {

            if (key.match(/access/)) {
                val = (values[key]) ? "admin" : "user";
            } else {
                val = values[key]
            }

        } else {

            count++;
            array[count] = {};
            if (key.match(/access/)) {
                val = (values[key]) ? "admin" : "user";
            } else {
                val = values[key]
            }
        }
        array[count][key.slice(0, key.length - 1)] = val;
    }

    for (var index in array) {
        if (!array[index]["access"]) {
            array[index]["access"] = "user";
        }
    }

    return array;
}
