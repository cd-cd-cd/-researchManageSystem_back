import dayjs from 'dayjs'
import path from 'path'
import fs from 'fs'
import { client } from './oss'
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

// 上传文件
export const put = async (file: any, ossSrc: string) => {
      const fileName = dayjs() + file.name
      console.log(fileName)
      const filePath = path.join(__dirname, '../', `/public/uploads/${file.name}`)
      const result = await client.put(ossSrc + fileName, filePath)
      const { url, res: { status } } = result
      if (status === 200) {
        return url
      } else {
        return undefined
      }
    }