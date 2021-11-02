const fs = require('fs')
const { promisify } = require('util')
const path = require('path')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

exports.getLocalImg = async (localImgPath) =>{
    const data = await readFile(localImgPath)
    return data
}
exports.saveLocalImg = async (localImgPath,data) =>{
    await writeFile(localImgPath,data)
}