import { create, Text, Wraper} from './createElement';
import { Timeline, Animation } from './animation';
import { ease } from './cubicBezier';

import { enableGesture } from './gesture';

import css from './carousel.css';
console.log(css)

export class Carousel{

    constructor(config){
        this.config = config;
        this.children = [];
        this.data = [
            "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
            "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
            "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
            "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
        ];
        this.root = document.createElement('div')
        console.log('config', config)
    }

    setAttribute(name, val){
        this.root.setAttribute(name, val)
    }

    appendChild(child){
        this.children.push(child)
    }

    mountTo(parent){
        this.render().mountTo(parent)
    }

    render(){

      let timeline = new Timeline;
      timeline.start();

      let position = 0;

      let nextPicStopHandler = null;

      let children = this.data.map((item, currposition) => {

          let lastPosition = (currposition - 1 + this.data.length) % this.data.length;
          let nextPosition = (currposition + 1) % this.data.length;

          let offset = 0;

          let onStart = () => {
            timeline.pause();
            clearTimeout(nextPicStopHandler)

            let currElement = children[currposition]
            let currTransfronValue = Number(currElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1])
            offset = currTransfronValue + currposition * 500

          }
    
          let onPan = event => {

            let lastElement = children[lastPosition]
            let currElement = children[currposition]
            let nextElement = children[nextPosition]
            
            let currTransfronValue = - 500 * lastPosition + offset
            let lastTransfronValue = - 500 - 500 * lastPosition + offset
            let nextTransfronValue = 500 - 500 * lastPosition + offset

            let dx = event.clientX - event.startX

            lastElement.style.transform = `translateX(${lastTransfronValue + dx}px)`
            currElement.style.transform = `translateX(${currTransfronValue + dx}px)`
            nextElement.style.transform = `translateX(${nextTransfronValue + dx}px)`

            console.log(currTransfronValue)
          }

          let onPanend = event => {
            let direction = 0
            let dx = event. clientX - event. startX;

            console.log(event);

            if(dx + offset > 250 || dx > 0 && event.flick)
              direction = 1;
            else if(dx + offset < -250 || dx < 0 && event.flick)
              direction = -1

            timeline.reset();
            timeline.start();

            let lastElement = children[lastPosition];
            let currentElement = children[currposition];
            let nextElement = children[nextPosition];

            let lastAnimation = new Animation( lastElement.style, "transform",- 500 - 500 * lastPosition + offset + dx, -500 - 500 * lastPosition + direction * 500, 500, 0, ease, v =>`translateX(${v}px)`);
            let currentAnimation = new Animation( currentElement. style, "transform", - 500 * currposition + offset + dx, - 500 * currposition + direction * 500, 500, 0, ease, v =>`translateX(${v}px)` );
            let nextAnimation = new Animation( nextElement.style, "transform", 500 - 500 * nextPosition + offset + dx, 500 - 500 * nextPosition + direction * 500, 500, 0, ease, v =>`translateX(${v}px)`);
            
            timeline.add(lastAnimation) ;
            timeline.add(currentAnimation);
            timeline.add(nextAnimation);

            position = (position - direction + this. data.length) % this.data.length;
            nextPicStopHandler = setTimeout(nextImg, 3000);
          }

          let element = <img src={item} onStart={onStart} onPan={onPan} onPanend={onPanend} enableGesture={true} />;
          element.style.transform = 'translateX(0px)'
          element.addEventListener("dragstart", event => event.preventDefault())
          return element
      })

      let root = <div class='carousel'>
          {  children }
      </div>

      // 迁移
      
      let nextImg = () => {
        let nextPosition = (position + 1) % this.data.length

        let curr = children[position]
        let next = children[nextPosition]

        let currentAnimation = new Animation(curr.style, 'transform', - 100 * position, - 100 - 100 * position, 500, 0, ease, v => `translateX(${ 5 * v }px)`)
        let nextAnimation = new Animation(next.style, 'transform', 100 -100 * nextPosition, -100 * nextPosition, 500, 0, ease, v => `translateX(${ 5 * v }px)`)

        timeline.add(currentAnimation)
        timeline.add(nextAnimation)


        position = nextPosition

        // curr.style.transition = "ease 0s";
        // next.style.transition = "ease 0s";

        // curr.style.transform = `translateX(${ - 100 * position}%)`
        // next.style.transform = `translateX(${100 -100 * nextPosition}%)`

        // setTimeout(function(){
        //   curr.style.transition = "ease 0.5s";
        //   next.style.transition = "ease 0.5s";

        //   curr.style.transform = `translateX(${ -100 - 100 * position}%)`
        //   next.style.transform = `translateX(${-100 * nextPosition}%)`

        //   position = nextPosition
        // }, 16)
        
        nextPicStopHandler = setTimeout(nextImg, 3000)
      }
      // 拖拽
      root.addEventListener('mousedown', event => {
          let startX = event.clientX;
          let lastPosition = (position - 1 + this.data.length) % this.data.length;
          let nextPosition = (position + 1) % this.data.length;

          let curr = children[position]
          let last = children[lastPosition]
          let next = children[nextPosition]
          // 停止动画
          curr.style.transition = "ease 0s";
          last.style.transition = "ease 0s";
          next.style.transition = "ease 0s";

          curr.style.transform = `translateX(${ - 500 * position}px)`
          last.style.transform = `translateX(${ -500 - 500 * lastPosition}px)`
          next.style.transform = `translateX(${ 500 - 500 * nextPosition}px)`

          let move = event => {
            curr.style.transform = `translateX(${ event.clientX - startX - 500 * position}px)`
            last.style.transform = `translateX(${ event.clientX - startX - 500 - 500 * lastPosition}px)`
            next.style.transform = `translateX(${ event.clientX - startX + 500 - 500 * nextPosition}px)`
          }

          let up = event => {
            let offset = 0;
            if(event.clientX - startX > 250){
              offset = 1;
            }else if(event.clientX - startX < -250){
              offset = -1;
            }
            // 开始动画
            curr.style.transition = "";
            last.style.transition = "";
            next.style.transition = "";

            curr.style.transform = `translateX(${ 500 * ( offset - position) }px)`
            last.style.transform = `translateX(${ 500 * ( offset - 1 - lastPosition) }px)`
            next.style.transform = `translateX(${ 500 * ( offset + 1 - nextPosition) }px)`

            position = (position - offset + this.data.length) % this.data.length;

            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
          }

          document.addEventListener('mousemove', move);
          document.addEventListener('mouseup', up);
        })

      nextPicStopHandler = setTimeout(nextImg, 3000)

      return root
    }

}