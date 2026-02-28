import { useEffect, useState } from 'react'
import { MeetingRoomUser } from './RoomUser'
import { LocalClientRTC } from '@/utils/LocalClientRTC'
import { MeetingError } from './MeetingError'
import { USER_DRAW_UP_STATE } from '@/constant'

type MeetingRoomProps = {
  /** 会议ID */
  meetingId: string
  /** 用户ID */
  userId: string
}

export const MeetingRoom = ({ userId }: MeetingRoomProps) => {
  const [userDrawUp, setUserDrawUp] = useState<(typeof USER_DRAW_UP_STATE)[keyof typeof USER_DRAW_UP_STATE]>(
    USER_DRAW_UP_STATE.ENTER
  )
  const [error, setError] = useState<Error | string | null>(null)
  const localClientRTC = LocalClientRTC.getInstance(userId)

  useEffect(() => {
    localClientRTC.joinPromise
      .then(() => {
        setUserDrawUp(USER_DRAW_UP_STATE.COME)
      })
      .catch((err) => {
        setUserDrawUp(USER_DRAW_UP_STATE.FAIL)
        setError(err)
      })
  }, [localClientRTC])

  if (userDrawUp === USER_DRAW_UP_STATE.ENTER) return <MeetingRoomUser />
  if (error) return <MeetingError error={error} />

  return <div className="min-h-screen bg-gray-900 flex flex-col">加入会员成功</div>
}
