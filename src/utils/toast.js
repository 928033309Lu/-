const TOAST_CLASS = 'toast'

function toast(msg, time = 2000) {
  let body = document.querySelector('#app');
  let toastElem = document.createElement('div');
  toastElem.innerHTML = msg;
  toastElem.setAttribute('class', TOAST_CLASS);
  body.appendChild(toastElem);
  setTimeout(function () {
    toastElem.setAttribute('class', 'toast out');
  }, time);
  setTimeout(function () {
    let elm = body.querySelector('.toast');
    if (elm) {
      body.removeChild(elm);
    }
  }, time + 3000)
}

export {
  toast
}

