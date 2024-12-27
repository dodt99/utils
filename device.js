export const isWindowsOs = () => {
  return getOs() === 'Windows'
}

export const getOs = () => {
  const os = ['Windows', 'Linux', 'Mac'] // add your OS values
  return os.find((v) => navigator.appVersion.indexOf(v) >= 0)
}

const isFirefox = () => {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1
}

export const getDevicePixelRatio = () => {
  return isWindowsOs() && !isFirefox() ? window.devicePixelRatio : 1
}

export const getInnerHeight = () => {
  return window.innerHeight * getDevicePixelRatio()
}

export const getInnerWidth = () => {
  return window.innerWidth * getDevicePixelRatio()
}
