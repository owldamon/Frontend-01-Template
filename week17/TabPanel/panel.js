import { create, Text, Wraper} from './createElement';
import { Timeline, Animation } from './animation';
import { ease } from './cubicBezier';

import { enableGesture } from './gesture';

export class Panel{

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

    select(i){
      for (let item of this.titleView){
        item.classList.remove = 'checked';
      }

      this.titleView[i].classList.add = 'checked';

      for (let item of this.childView){
        item.style.display = 'none';
      }

      this.childView[i].style.display = '';

    }

    render(){
      this.titleView = this.children.map((item, index) => <span style="padding: 10px 30px;" onClick={() => this.select(index)}>{item.getAttribute('title') || ' '}</span>)
      this.childView = this.children.map(item => <div style="width: 500px; height: 500px;">{item}</div>)
      setTimeout(() => this.select(0), 16)
      return <div class="panel">
        <h1 style="width: 500px;border-bottom: 1px solid lightblue">{this.titleView}</h1>
        <div>
          {this.childView}
        </div>
      </div>
    }

    mountTo(parent){
        this.render().mountTo(parent)
    }

}