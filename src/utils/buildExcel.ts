import { ICopyRight, IDevice, IMeeting, IPatent, IProject, IReimbursement, IReport, IRquest, IThesis, IWin } from "../libs/model"
import xlsx from 'node-xlsx'

export const exportExcel = (
  title: string[],
  data: IDevice[]
  | IMeeting[]
  | IReimbursement[]
  | IReport[]
  | IRquest[]
  | IProject[]
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

interface ISingleExcel {
  name: string
  title: string[]
  data: IThesis[]
  | IPatent[]
  | ICopyRight[]
  | IWin[]
  | undefined
  options: {}
}

type Ixlsx  = {
    name: string
    data: string[][]
    options: {}
}[]

export const exportManyExcel = (
  value: ISingleExcel[]
) => {
  let xlsxObj: Ixlsx = []
  value.forEach(item => {
    let tempData = [item.title]
    console.log('data', item.data)
    item.data?.forEach(item  => {
      tempData.push(Object.values(item))
    })
    xlsxObj.push({
      name: item.name,
      data: tempData,
      options: item.options
    })
  })
  return xlsx.build(xlsxObj)
}