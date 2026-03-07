import { useState } from 'react'
import { MeetingRoomUser } from './RoomUser'
import { MeetingError } from './MeetingError'
import { USER_DRAW_UP_STATE } from '@/constant'
import { MeetingGrid } from './Grid'
import { MeetingToolbar } from './Toolbar'
import { useMeeting } from '@/hook/useMeeting'
import { waitBeFindNode } from '@/utils'

type MeetingRoomProps = {
  /** 会议ID */
  meetingId: string
  /** 用户ID */
  userId: string
}

export const MeetingRoom = ({ userId, meetingId }: MeetingRoomProps) => {
  const [roomUsers, setRoomUser] = useState(['self'])

  const {
    joinState: userDrawUp,
    error,
    cameraTrack: localCameraTrack,
    micTrack: localMicTrack,
    touchCameraTrack,
    touchMicTrack,
    closeCameraTrack,
    closeMicTrack,
  } = useMeeting({
    userId,
    meetingId,
    onRemoteUserJoin: (id, play) => {
      const newUsers = new Set(roomUsers)

      const selector = `#${id}`
      waitBeFindNode(selector, () => play(selector))
      if (newUsers.has(id)) return void 0

      newUsers.add(id)
      setRoomUser([...newUsers])
    },
    onRemoteUserLeave: (id) => {
      const newUsers = new Set(roomUsers)
      newUsers.delete(id)
      setRoomUser([...newUsers])
    },
  })

  if (userDrawUp === USER_DRAW_UP_STATE.ENTER) return <MeetingRoomUser />
  if (error) return <MeetingError error={error} />

  return (
    <MeetingGrid
      users={roomUsers}
      children={
        <MeetingToolbar
          hasCameraTrack={!!localCameraTrack}
          hasMicTrack={!!localMicTrack}
          onCameraOpen={touchCameraTrack}
          onCameraClose={closeCameraTrack}
          onMicOpen={touchMicTrack}
          onMicClose={closeMicTrack}
        />
      }
    />
  )
}
