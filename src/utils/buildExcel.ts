import { IDevice } from "../libs/model"
import xlsx from 'node-xlsx'

export const deviceExcel = (data: IDevice[], options={}) => {
  let xlsxObj = [
    {
      name: "sheet",
      data: [
        [
          '编号',
          '名称',
          '型号',
          '原值',
          '设备性能指标',
          '存放地',
          '状态',
          '入库日期',
          '主机备注',
          '备注',
          '添加日期'
        ]
      ],
      options
    }
  ]
  data.forEach(item => {
    xlsxObj[0].data.push(Object.values(item))
  })
  return xlsx.build(xlsxObj)
}