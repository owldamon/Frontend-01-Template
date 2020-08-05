
// 控制多个动画的动作
export class Timeline{

  constructor(){
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.tickID = null;
    this.pauseTime = null;
    this.state = 'inited';
    this.tick = () => {
      let t = Date.now() - this.startTime;
      // let animations = this.animations.filter(animation => !animation.finished)
      for(let item of this.animations){
        
        let { object, property, template, timingFunction, start, end, duration, delay, startTime } = item;
        
        let addTime = this.addTimes.get(item)
         
        let progression = timingFunction((t - delay - addTime) / duration)
        
        if(t > duration + delay + addTime){
          progression = 1;
          this.animations.delete(item);
          this.finishedAnimations.add(item)
        }
        // console.log('progression:', progression)
        let value = item.valueFromProression(progression)
        if(progression > 0)
          object[property] = template(value);
  
      }
  
      if(this.animations.size)
        this.tickID = requestAnimationFrame(this.tick)
      else
        this.tickID = null
    }
  }

  pause(){
    if(this.state !== 'playing')
      return
    this.state = 'paused'
    this.pauseTime = Date.now();
    if(this.tickID  !== null){
      cancelAnimationFrame(this.tickID)
      this.tickID = null
    }
  }

  resume(){
    if(this.state !== 'paused')
      return
    this.state = 'playing'
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  start(){
    if(this.state !== 'inited')
      return
    this.state = 'playing'
    this.startTime = Date.now();
    this.tick();
  }

  reset(){
    if(this.state === 'playing')
      this.pause();
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addtimes = new Map();
    this.tickID = null;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.state = 'inited';
  }

  restart(){
    if(this.state === 'playing')
      this.pause();

    for(let item of this.finishedAnimations)
      this.animations.add(item)
      
    this.finishedAnimations = new Set();
    this.tickID = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick()
  }

  add(animation, startTime){
    this.animations.add(animation);
    if(this.state === 'playing' && this.tickID === null)
      this.tick()

    if(this.state === 'playing'){
      this.addTimes.set(animation, startTime !== void 0 ? startTime : Date.now() - this.startTime)
    }
    else{
      this.addTimes.set(animation, startTime !== void 0 ? startTime : 0)
    }
  }
}

export class Animation{
  constructor(object, property, start, end, duration, delay, timingFunction, template){
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.template = template;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction
  }
  valueFromProression(proression){
    return this.start + proression * (this.end - this.start)
  }
}

export class ColorAnimation{
  constructor(object, property, start, end, duration, delay, timingFunction, template){
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction
  }

  valueFromProression(proression){
    return {
      r: this.start.r + proression * (this.end.r - this.start.r),
      g: this.start.g + proression * (this.end.g - this.start.g),
      b: this.start.b + proression * (this.end.b - this.start.b),
      a: this.start.a + proression * (this.end.a - this.start.a),
    }
  }
}