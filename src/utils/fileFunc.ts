import fs from 'fs'
// 删除文件下所有文件
export const removeFileDir = (path: string)=>{
  var files = fs.readdirSync(path)
      for (let item of files) {
          var stats = fs.statSync(`${path}/${item}`)
          if (stats.isDirectory()) {
              removeFileDir(`${path}/${item}`)
          } else {
              fs.unlinkSync(`${path}/${item}`)
          }
      }
      fs.rmdirSync(path)
}