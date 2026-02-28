import { useState } from 'react'
import { MeetingRoomUser } from './RoomUser'

type MeetingRoomProps = {
  /** 会议ID */
  meetingId: string
  /** 用户ID */
  userId: string
}

export const MeetingRoom = (props: MeetingRoomProps) => {
  const [user, setUser] = useState<AliMeetingTokenResponse | null>(null)
  if (user === null) {
    return <MeetingRoomUser userId={props.userId.toString()} setUser={setUser} />
  }

  return (
    <div>
      <h1>会议房间</h1>
      <p>会议ID: {props.meetingId}</p>
      <p>用户ID: {props.userId}</p>
    </div>
  )
}
