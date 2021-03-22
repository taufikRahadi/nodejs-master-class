const isString = (val) => typeof(val) === 'string'
const isNotEmpty = (val) => val.trim().length > 0
const minLength = (length, val) => val.length <= length
const isBoolean = (val) => typeof(val) === 'boolean'

module.exports = {
  isString, isNotEmpty, minLength, isBoolean
}
