import OSS from 'ali-oss'

export const client = new OSS({ // 链接oss 这里面的配置最好是放在单独的文件，引入如果要上传的git的话账号密码最好不要传到git
  region: 'oss-cn-beijing', // oss地区，只需要把 hangzhou 改为相应地区即可，可以在oss上随便找一个文件链接就知道是哪个地区的了
  accessKeyId: 'LTAI5tRBb49GrwPGhhqFxZJ6', // oss秘钥
  accessKeySecret: 'f97BbDERM8z5aJv9vBK8p6Bz1jUOeZ', // oss秘钥的密码
  bucket: 'searchchendian', // 存储库名称
})

export const endPoint = 'searchchendian.oss-cn-beijing.aliyuncs.com'
export const bucket = 'searchchendian'