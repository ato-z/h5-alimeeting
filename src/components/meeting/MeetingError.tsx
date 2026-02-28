import React from 'react'

type MeetingErrorProps = {
  /** 错误信息，可以是 Error 对象、字符串或 null */
  error: Error | string | null
}

export const MeetingError = ({ error }: MeetingErrorProps) => {
  // 获取错误展示信息
  const getErrorMessage = (): string => {
    if (error === null) {
      return '服务器繁忙请稍后重试'
    }

    if (error instanceof Error) {
      return error.message
    }

    return error
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 shadow-xl">
        {/* 错误图标 */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h2 className="text-2xl font-bold text-white text-center mb-4">加入会议失败</h2>

        {/* 错误信息 */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-center">{errorMessage}</p>
        </div>

        {/* 详细错误信息（仅 Error 对象时显示） */}
        {error instanceof Error && error.stack && (
          <details className="mb-6">
            <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300 transition-colors">
              查看详细信息
            </summary>
            <pre className="mt-3 text-xs text-gray-500 bg-gray-900 rounded p-3 overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}

        {/* 操作按钮 */}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          重新加载
        </button>
      </div>
    </div>
  )
}
