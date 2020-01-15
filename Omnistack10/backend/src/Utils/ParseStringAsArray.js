module.exports = function ParseStringAsArray(arrayAsString){
    return arrayAsString.split(',').map(index => index.trim());
}