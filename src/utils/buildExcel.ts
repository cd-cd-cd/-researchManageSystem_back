import { IDevice, IMeeting, IReimbursement, IReport, IRquest } from "../libs/model"
import xlsx from 'node-xlsx'

export const exportExcel = (
  title: string[],
  data: IDevice[]
  | IMeeting[]
  | IReimbursement[]
  | IReport[]
  | IRquest[]
  ,
  options = {}
) => {
  let xlsxObj = [
    {
      name: "sheet",
      data: [title],
      options
    }
  ]
  data.forEach(item => {
    xlsxObj[0].data.push(Object.values(item))
  })
  return xlsx.build(xlsxObj)
}