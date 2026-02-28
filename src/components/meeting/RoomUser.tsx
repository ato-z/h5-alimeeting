type MeetingRoomUserProps = {
  userId?: string
  setUser: React.Dispatch<React.SetStateAction<AliMeetingTokenResponse | null>>
}

export const MeetingRoomUser = (props: MeetingRoomUserProps) => {
  return (
    <div>
      <h1>获取用户信息: {props.userId}</h1>
    </div>
  )
}
