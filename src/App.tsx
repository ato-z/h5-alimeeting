import { useState } from 'react'
import { MeetingAttend } from '@/components/meeting/Attend'
import { MeetingPreparation } from '@/components/meeting/Preparation'
import { MeetingRoom } from './components/meeting/Room'

// 检查时间

function App() {
  const [state, setState] = useState<MeetingState>('attend')
  const [meeting, setMeeting] = useState<MeetingDetailResponse | null>(null)
  const [meetingId] = useState<string>('12')
  const [userId] = useState<string>('1')

  // 如果会议详情数据不存在，则进入获取会议详情阶段
  if (meeting === null) {
    return <MeetingAttend setMeeting={setMeeting} setState={setState} mettingId={meetingId} />
  }

  // 如果不存在确认时间并且 确认时间小小于当前时间，则进入会议预备阶段
  if (state !== 'ongoing') {
    return <MeetingPreparation meeting={meeting} />
  }

  return <MeetingRoom meetingId={meetingId} userId={userId} />
}

export default App
