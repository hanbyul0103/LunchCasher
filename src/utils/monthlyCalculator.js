function sum(array) {
    if (array.length === 0) return 0;

    let sum = 0;

    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

function average(array) {
    const sum = sum(array);
    const average = sum / array.length;

    return average;
}

export { sum, average };