import _ from "lodash";

export default function processPlayArrayForm(values) {

    const array = [{}];
    let count = 0;
    let val;
    for (var key in values) {

        if (key.match(count)) {

            val = values[key];

        } else {

            count++;
            array[count] = {};
            val = values[key];

        }
        array[count][key.slice(0, key.length - 1)] = val;
    }
    return array;
}
