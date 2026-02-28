import { useCallback, useState } from 'react'
import { MeetingAttend } from '@/components/meeting/Attend'
import { MeetingPreparation } from '@/components/meeting/Preparation'
import { MeetingRoom } from '@/components/meeting/Room'
import { getServerTime } from '@/api/meeting'

// 检查时间

function App() {
  const [state, setState] = useState<MeetingState>('attend')
  const [meeting, setMeeting] = useState<MeetingDetailResponse | null>(null)
  const [meetingId] = useState<string>('12')
  const [userId] = useState<string>('1')

  const determineMeetingState = useCallback(async (meeting: MeetingDetailResponse) => {
    try {
      const serverTime = await getServerTime()
      const currentTime = serverTime.timestamp

      // 如果会议确认时间为空，说明会议还未被确认，进入准备阶段
      if (!meeting.confirm_time) {
        setState('preparation')
        return
      }

      // 如果会议确认时间存在，转换为时间戳
      const confirmTime = new Date(meeting.confirm_time).getTime()

      // 比较确认时间和当前时间
      // 如果确认时间小于当前时间，会议已到，进入进行中阶段
      // 如果确认时间大于当前时间，会议还未到，进入准备阶段
      if (confirmTime <= currentTime) {
        setState('ongoing')
      } else {
        setState('preparation')
      }
    } catch (error) {
      console.error('获取服务器时间失败:', error)
      // 如果获取服务器时间失败，默认进入准备阶段
      setState('preparation')
    }
  }, [])

  // 如果会议详情数据不存在，则进入获取会议详情阶段
  if (meeting === null) {
    return <MeetingAttend meeting={meeting} setMeeting={setMeeting} mettingId={meetingId} />
  }

  // 如果会议详情数据存在但会议未开始，则进入会议预备阶段
  if (meeting && state === 'attend') {
    determineMeetingState(meeting)
  }

  // 如果不存在确认时间并且 确认时间小小于当前时间，则进入会议预备阶段
  if (state !== 'ongoing') {
    return <MeetingPreparation state={state} meeting={meeting} />
  }

  return <MeetingRoom meetingId={meetingId} userId={userId} />
}

export default App
