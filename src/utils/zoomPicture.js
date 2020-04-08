/**
 * Created by supervisor on 2019/11/28
 */

function fnWheel (obj, fncc) {
  eleList = obj
  obj.forEach(function (item) {
    item.onmousewheel = fn
    if (item.addEventListener) {
      item.addEventListener('DOMMouseScroll', fn, false)
      item.onmousedown = initDrag
      item.onmouseup = function () {
        isdrag = false
      }
    }
  })

  function fn (ev) {
    const oEvent = ev || window.event
    let down = true
    if (oEvent.detail) {
      down = oEvent.detail > 0
    } else {
      down = oEvent.wheelDelta < 0
    }
    if (fncc) {
      fncc.call(this, down, oEvent)
    }
    if (oEvent.preventDefault) {
      oEvent.preventDefault()
    }
    return false
  }
}

// 拖拽

const ie = document.all
const nn6 = document.getElementByIdx && !document.all
var isdrag = false
let y, x
let oDragObj
let nTX, nTY
const defaultClassName = 'dragAble'
let eleList

function moveMouse (e) {
  let moveTop, moveLeft
  if (isdrag) {
    // oDragObj.style.top = (nn6 ? nTY + e.clientY - y : nTY + event.clientY - y) + 'px'
    moveTop = (nn6 ? nTY + e.clientY - y : nTY + event.clientY - y) + 'px'
    // oDragObj.style.left = (nn6 ? nTX + e.clientX - x : nTX + event.clientX - x) + 'px'
    moveLeft = (nn6 ? nTX + e.clientX - x : nTX + event.clientX - x) + 'px'
    eleList.forEach(function (item) {
      item.style.top = moveTop
      item.style.left = moveLeft
    })
    return false
  }
}

function initDrag (e) {
  let oDragHandle = nn6 ? e.target : event.srcElement
  const topElement = 'HTML'
  while (oDragHandle.tagName !== topElement && oDragHandle.className !== 'dragAble') {
    oDragHandle = nn6 ? oDragHandle.parentNode : oDragHandle.parentElement
  }
  if (oDragHandle.className === defaultClassName) {
    isdrag = true
    oDragObj = oDragHandle
    nTY = parseInt(oDragObj.style.top + 0)
    y = nn6 ? e.clientY : event.clientY
    nTX = parseInt(oDragObj.style.left + 0)
    x = nn6 ? e.clientX : event.clientX
    document.onmousemove = moveMouse
    return false
  }
}

export {
  initDrag,
  fnWheel
}

// document.onmousedown = initDrag
// document.onmouseup = new Function("isdrag=false");
