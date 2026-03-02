import React, { useEffect, useState } from 'react'

type MeetingGridProp = {
  users: string[]
  children: React.ReactNode
}

// 网格规格: 每档最多容纳的用户数
const SPEC = [1, 2, 4, 6, 9, 12, 16]

// 根据规格索引返回列数
const DESKTOP_COLS = [1, 2, 2, 3, 3, 4, 4]
const MOBILE_COLS = [1, 1, 2, 2, 2, 2, 2]

function getSpecIndex(count: number): number {
  return SPEC.findIndex((max) => count <= max) ?? SPEC.length - 1
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => !window.matchMedia('(min-width: 768px)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export const MeetingGrid = ({ users, children }: MeetingGridProp) => {
  const isMobile = useIsMobile()

  if (users.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto w-10 h-10 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <p className="text-gray-300 text-sm">正在加入会议...</p>
        </div>
      </div>
    )
  }

  const specIdx = getSpecIndex(users.length)
  const cols = isMobile ? MOBILE_COLS[specIdx] : DESKTOP_COLS[specIdx]
  const rows = Math.ceil(users.length / cols)

  return (
    <article
      className="fixed inset-0 bg-gray-900 grid gap-px"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}>
      {users.map((userId) => (
        <section
          key={userId}
          id={userId}
          className="bg-gray-800 flex items-center justify-center overflow-hidden relative video-container">
          {userId === 'self' && children}
        </section>
      ))}
    </article>
  )
}
