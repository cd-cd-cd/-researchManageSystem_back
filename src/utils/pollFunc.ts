import schedule from 'node-schedule'
import { DeviceDelivery } from '../entity/device_delivery'
import dayjs from 'dayjs'
import { getManager, LessThan, MoreThan } from 'typeorm'
import { Context } from 'koa'
import { Equipment } from '../entity/equipment'
import { DeviceEntry } from '../entity/device_entry'
import { Meeting } from '../entity/meeting'
// 设备定时归还
const returnRoll = () => {
  // 每天凌晨12:30触发 归还设备
  schedule.scheduleJob('30 0 0 * * *', async () => {
    const willUpdateObj = await getManager().getRepository(DeviceDelivery)
      .find({
        deviceApply_end_Time: LessThan(dayjs().format('YYYY-MM-DD'))
      })
    if (willUpdateObj.length) {
      const tempArr = willUpdateObj.reduce((pre: Equipment[], cur) => {
        pre.push(cur.equipment)
        return pre
      }, [])
      console.log(tempArr, 'tempArr')
      for (let equipment of tempArr) {
        await getManager().getRepository(Equipment).update({ id: equipment.id }, { recipient: '', state: 0 })
          await getManager().getRepository(DeviceDelivery).delete({ equipment })
          const entry = new DeviceEntry()
          entry.equipment = equipment
          await getManager().getRepository(DeviceEntry).save(entry)
      }
    }
  })

  // 会议
  schedule.scheduleJob('1 * * * * *', async () => {
    const nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const endMeeting = await getManager().getRepository(Meeting)
    .find({
      endTime: LessThan(nowTime)
    })
    const ingMeeting = await getManager().getRepository(Meeting)
    .find({
      startTime: LessThan(nowTime),
      endTime: MoreThan(nowTime)
    })

    // 结束
    if (endMeeting.length) {
      for (let meet of endMeeting) {
        await getManager().getRepository(Meeting).update({ id: meet.id }, { meetState: -1 })
      }
    }

    // 进行中
    if (ingMeeting.length) {
      for (let meet of ingMeeting) {
        await getManager().getRepository(Meeting).update({ id: meet.id }, { meetState: 0 })
      }
    }
  })
}

export default returnRoll
