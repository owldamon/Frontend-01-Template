import { create, Text, Wraper} from './createElement';
import { Timeline, Animation } from './animation';
import { ease } from './cubicBezier';

import { enableGesture } from './gesture';

export class ListView{

    constructor(config){
        this.children = [];
        this.root = document.createElement('div')
    }

    setAttribute(name, val){
      this[name] = val
        // this.root.setAttribute(name, val)
    }

    getAttribute(name){
      return this[name];
    }


    appendChild(child){
      this.children.push(child)
    }

    render(){
      let data = this.getAttribute('data')
      return <div class="listview">
        {
          data.map(this.children[0])
        }
      </div>
    }

    mountTo(parent){
        this.render().mountTo(parent)
    }

}