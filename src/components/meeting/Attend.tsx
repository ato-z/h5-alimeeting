import { getMeetingDetail } from '@/api/meeting'
import { useCallback, useState } from 'react'

interface MeetingAttendProps {
  mettingId?: string
  meeting: MeetingDetailResponse | null
  setMeeting: (meeting: MeetingDetailResponse) => void
}

/**
 * 获取会议详情
 * @param param0
 * @returns
 */
export const MeetingAttend = ({ meeting, setMeeting, mettingId }: MeetingAttendProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchMeeting = useCallback(
    async (mettingId: string) => {
      try {
        const data = await getMeetingDetail(mettingId)
        if (data) {
          setMeeting(data)
        } else {
          setError('会议不存在或者已结束')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取会议详情失败')
      } finally {
        setIsLoading(false)
      }
    },
    [setMeeting]
  )

  if (!mettingId) {
    setError('会议ID不存在')
    setIsLoading(false)
  }

  if (mettingId && !meeting) {
    fetchMeeting(mettingId)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">获取失败</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">正在获取会议详情</h2>
          <p className="text-gray-500 mt-2">请稍候...</p>
        </div>
      </div>
    )
  }

  return null
}
