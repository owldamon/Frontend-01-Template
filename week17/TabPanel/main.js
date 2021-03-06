import { create, Text, Wraper} from './createElement';
import { ListView } from './listview';
import { Carousel } from './carousel';
import { Panel } from './panel';

// const data = [
//     { title: 'mao1', src: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg" },
//     { title: 'mao1', src: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg"},
//     { title: 'mao1', src: "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg"},
//     { title: 'mao1', src: "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"},
// ];
// let component = <Panel>
//     <span title="title1">component1</span>
//     <span title="title2">component2</span>
//     <span title="title3">component3</span>
//     <span title="title4">component4</span>
// </Panel>

// let component = <ListView data={data}>
//     {
//         record => <figure>
//             <img src={record.src} />
//             <figcaption>{record.title}</figcaption>
//         </figure>
//     }
// </ListView>

let component = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
]} />

component.mountTo(document.body)
