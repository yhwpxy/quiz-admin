// localStorage 简单封装，带 try/catch 避免隐私模式下抛异常
export function getItem(key) {
  try {
    return localStorage.getItem(key) || ''
  } catch (e) {
    return ''
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    /* ignore */
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    /* ignore */
  }
}
