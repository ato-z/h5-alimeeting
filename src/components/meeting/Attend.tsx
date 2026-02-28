import { getMeetingDetail } from '@/api/meeting'
import { useEffect, useState } from 'react'

interface MeetingAttendProps {
  mettingId?: string
  setMeeting: (meeting: MeetingDetailResponse) => void
  setState: (state: MeetingState) => void
}

/**
 * 获取会议详情
 * @param param0
 * @returns
 */
export const MeetingAttend = ({ setMeeting, mettingId }: MeetingAttendProps) => {
  console.log('设置会议方法', setMeeting)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mettingId) return void 0
    getMeetingDetail(mettingId)
  }, [mettingId])

  if (!mettingId) {
    setError('会议ID不存在')
  }

  if (error) {
    return <div>获取会议详情失败：{error}</div>
  }

  return <div>正在获取会议详情</div>
}
