
export function enableGesture(element){

  let contexts = Object.create(null);
  let MOUSE_SYSMOL = Symbol('mouse');

  // 判断触摸屏
  if(document.ontouchstart !== null)
    element.addEventListener("mousedown", (event) => {
      contexts[MOUSE_SYSMOL] = Object.create(null)
      start(event, contexts[MOUSE_SYSMOL])
      let mousemove = event => {
        move(event, contexts[MOUSE_SYSMOL]) 
      }

      let mouseend = event => {
        end(event, contexts[MOUSE_SYSMOL])
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseend)
      }

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseend);

    })

  element.addEventListener("touchstart", event => {
    for(let touch of event.changedTouches){
      contexts[touch.identifier] = Object.create(null)
      start(touch, contexts[touch.identifier])
      // Touch.identifier
      // 返回一个可以唯一地识别和触摸平面接触的点的值. 这个值在这根手指（或触摸笔等）所引发的所有事件中保持一致, 直到它离开触摸平面.
    }
  })

  element.addEventListener("touchmove", event => {
    for(let touch of event.changedTouches){
      move(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener("touchend", event => {
    for(let touch of event.changedTouches){
      end(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener("touchcancel", event => {
    for(let touch of event.changedTouches){
      cancel(touch, touch.identifier)
    }
  })

  const start = (point, context) => {
    
    element.dispatchEvent(new CustomEvent('start'), {})

    context.startX = point.clientX; 
    context.startY = point.clientY;
    context.moves = [];
    context.tap = true;
    context.pan = false;
    context.press = false;

    context.handleTimeout = setTimeout(() => {
      if(context.pan)
        return
      context.tap = false;
      context.pan = false;
      context.press = true;
      element.dispatchEvent(new CustomEvent('pressstart'), {})
    }, 500)

  }

  const move = (point, context) => {
    const dx = point.clientX - context.startX;
    const dy = point.clientY - context.startY;

    if(dx ** 2 + dy ** 2 > 100 && !context.pan){
      context.tap = false;
      context.pan = true;
      context.press = false;
      element.dispatchEvent(Object.assign(new CustomEvent('panstart'), {
        startX: context.clientX,
        startY: context.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
      }))
    }

    if(context.pan){
      element.dispatchEvent(Object.assign(new CustomEvent('pan'), {
        startX: context.clientX,
        startY: context.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
      }))
      context.moves.push({
        dx,
        dy,
        t: Date.now()
      })
      context.moves = context.moves.filter(item => Date.now() - item.t < 300)
    }
    // console.log('move', dx, dy)
  }

  const end = (point, context) => {
    console.log(context)
    if(context.pan){
      const dx = point.clientX - context.startX;
      const dy = point.clientY - context.startY;
      const record = context.moves[0];
      const speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy -dy ) ** 2) / (Date.now() - record.t)
      const isFlick = speed > 2.5;
      if(isFlick){
        element.dispatchEvent(Object.assign(new CustomEvent('flick'), {
          startX: context.clientX,
          startY: context.clientY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed
        }))
      }
      element.dispatchEvent(Object.assign(new CustomEvent('panend'), {
        startX: context.clientX,
        startY: context.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed,
        isFlick
      }))
    }
    if(context.tap)
      element.dispatchEvent(Object.assign(new CustomEvent('tap'), {}))
    if(context.press){
      element.dispatchEvent(Object.assign(new CustomEvent('pressend'), {}))
      clearTimeout(context.handleTimeout)
    }
  }

  const cancel = (point, context) => {
    clearTimeout(context.handleTimeout)
    element.dispatchEvent(Object.assign(new CustomEvent('cancel'), {}))
    // console.log('cancel', point)
  }
}
