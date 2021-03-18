/**
 * library for storing and editing data
 */

// dependencies
const { open, writeFile, close, readFile, openSync, truncate, unlink } = require('fs')
const { join } = require('path')

let lib = {}

// base directory of the data folder
lib.baseDir = join(process.cwd(), '/rest-api/.data/')

// write data to a file
lib.create = (dir, file, data, callback) => {
  const fileDescriptor = openSync(`${lib.baseDir + dir}/${file}.json`, 'wx')
  if (!fileDescriptor) callback('could not create a new file, it may already exists')

  // convert data to string
  const stringData = JSON.stringify(data)

  console.log(stringData)
  // write data to file
  writeFile(fileDescriptor, stringData, (err) => {
    if (err) callback(`error writing file`)

    close(fileDescriptor, (err) => {
      if (!err) callback(false)
      else callback('error closing file')
    })
  })
}

// read data from a file
lib.read = (dir, file, callback) => {
  readFile(`${lib.baseDir + dir}/${file}.json`, 'utf-8', (err, data) => {
    callback(err, data)
  })
}

// update data from a file
lib.update = (dir, file, data, callback) => {
  const fileDescriptor = openSync(`${lib.baseDir + dir}/${file}.json`, 'r+')
  if (!fileDescriptor) callback('could not update a file, it may not exists yet')

  // convert data to string
  const stringData = JSON.stringify(data)

  // truncate a file
  truncate(fileDescriptor, (err) => {
    if(err) callback('error truncating file')

    writeFile(fileDescriptor, stringData, (err) => {
      if (err) callback('error updating file', err)

      close(fileDescriptor, (err) => {
        if (err) callback('error closing file', err)
      })
    })
  })
}

// delete a file
lib.delete = (dir, file, callback) => {
  unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if (err) callback('error deleting file', err)
    callback(false)
  })
}

module.exports = lib
