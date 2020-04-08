export function getLabelIcon (turbineData) {
  let canvas = null
  let ctx = null
  const result = {
    url: '',
    width: 64,
    height: 80.5
  }
  switch (turbineData.sub_status) {
    default:
      canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 161
      ctx = canvas.getContext('2d')
      ctx.fillStyle = TurbineLabelColorConfig[turbineData.statues]
      ctx.beginPath()
      ctx.arc(64, 89, 64, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(56, 153)
      ctx.lineTo(72, 153)
      ctx.lineTo(64, 161)
      ctx.fill()

      if (turbineData.sub_status === 31 || turbineData.sub_status === 41) {
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(96, 32, 32, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()

        ctx.strokeStyle = '#04CF1B'
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(74, 30)
        ctx.lineTo(88, 48)
        ctx.lineTo(118, 16)
        ctx.stroke()
      }

      ctx.font = '50px bolder Microsoft YaHei'
      ctx.fillStyle = 'rgba(95,72,46,1)'
      ctx.fillText(turbineData.id, 18, 107)
      result.url = canvas.toDataURL('image/png', 1.0)
      break
    case 62:
      result.height = 68
      result.url = '/images/markers/label_repair.png'
      break
    case 63:
      result.height = 68
      result.url = '/images/markers/label_fault.png'
      break
  }
  return result
}

// 前期:0
// 接货:1
// 吊装:2
// 调试:3
// 试运行:4
// 预验收:5
// 质保:6
export const TurbineLabelColorConfig = {
  0: 'rgba(235,242,228,1)',
  1: 'rgba(209,255,110,1)',
  2: 'rgba(253,181,9,1)',
  3: 'rgba(44,208,185,1)',
  4: 'rgba(111,235,125,1)',
  5: 'rgba(149,167,255,1)',
  6: 'rgba(44,178,255,1)'
}
