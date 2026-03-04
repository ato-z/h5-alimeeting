/**
 * 返回本地当前日期，格式为 YYYY-MM-DD HH:mm:ss
 */
export const getCurrentLocalDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 等到某节点出现为止
 * @param selector 选择器
 * @param callback 回调函数
 * @returns 清理函数，用于取消观察
 */
export const waitBeFindNode = (selector: string, callback: () => unknown) => {
  // 先检查节点是否已经存在
  const node = document.querySelector(selector)
  if (node) {
    callback()
    return
  }

  // 使用 MutationObserver 监听 DOM 变化
  const observer = new MutationObserver(() => {
    const foundNode = document.querySelector(selector)
    if (foundNode) {
      callback()
      observer.disconnect()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // 返回清理函数
  return () => observer.disconnect()
}
