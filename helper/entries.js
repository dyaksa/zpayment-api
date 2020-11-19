module.exports = entries = (data) => {
    let result;
    Object.entries(data).map((item) => {
        parseInt(item[0]) > 0
        ? result = `${item[0]} = ${item[1]}`
        : result = `${item[0]} = '${item[1]}'`
    });
    return result;
}