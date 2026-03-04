type MeetingPreparationProps = {
  meeting: MeetingDetailResponse
  state: Omit<MeetingState, 'attend' | 'ongoing'>
}

/**
 * 会议预备阶段
 * @returns
 */
export const MeetingPreparation = ({ meeting, state }: MeetingPreparationProps) => {
  // 等待受邀确认状态
  if (!meeting.confirm_time) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">等待确认</h1>
            <p className="text-gray-600">等待受邀确认</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                与 {meeting.realname || meeting.nickname} 的会议
              </h2>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">请等待对方确认会议时间</p>
          </div>
        </div>
      </div>
    )
  }

  // 已确认会议时间
  const meetingTime = new Date(meeting.confirm_time)
  const now = new Date()
  const timeDiff = meetingTime.getTime() - now.getTime()
  const minutesLeft = Math.floor(timeDiff / 1000 / 60)

  // 已结束状态
  if (state === 'ended') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">会议已结束</h1>
            <p className="text-gray-600">感谢您的参与</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                与 {meeting.realname || meeting.nickname} 的会议
              </h2>
              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">
                  {meetingTime.toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">会议已结束</p>
          </div>
        </div>
      </div>
    )
  }

  // 准备状态（默认）
  if (state === 'preparation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-light rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">会议准备中</h1>
            <p className="text-gray-600">会议即将开始</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                与 {meeting.realname || meeting.nickname} 的会议
              </h2>
              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">
                  {meetingTime.toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'short' })}
                </span>
              </div>
            </div>

            {timeDiff > 0 && (
              <div className="bg-brand-light border border-brand rounded-lg p-4 text-center">
                <p className="text-brand-dark font-semibold text-lg">距离会议开始还有 {minutesLeft} 分钟</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">请等待主持人开启会议</p>
          </div>
        </div>
      </div>
    )
  }

  // 未进行交互状态（会议时间已到，但用户尚未触摸或点击屏幕）
  if (state === 'notTouch') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">请点击屏幕</h1>
            <p className="text-gray-600">请触摸或点击屏幕以进入会议</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                与 {meeting.realname || meeting.nickname} 的会议
              </h2>
              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">
                  {meetingTime.toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">请点击屏幕任意位置进入会议</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
