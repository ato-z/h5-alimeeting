export const MeetingRoomUser = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">正在准备</h2>
        <p className="text-gray-500">获取用户信息中...</p>
      </div>
    </div>
  )
}
