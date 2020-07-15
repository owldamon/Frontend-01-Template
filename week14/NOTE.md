# 第十四周总结

这周是关于组件化的内容，首先是搭建了一个具有 JSX 语法的环境，然后在该环境中设计与实现了一个轮播组件。最后学到了写技术博客的一些细节。

## 组件化——为组件添加JSX语法

以下是搭建组件化的关键步骤。

### 初始化项目

创建一个文件夹，并使用 npm init 命令初始化一个 package.json 文件。

### 安装依赖环境

--save-dev 表示将这些依赖安装到项目中，并且这些依赖是在开发和测试环境中使用。

``` node
npm install @babel/core --save-dev
npm install @babel/plugin-transform-react-jsx --save-dev
npm install @babel/preset-env --save-dev
npm install babel-loader --save-dev
npm install webpack --save-dev
npm install webpack-cli --save-dev
npm install webpack-dev-server --save-dev
```

### 配置 webpack 入口文件

将以下代码添加到新增的 webpack.config.js 文件中。

``` js
module.exports = {
    entry: './main.js',
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement'}]]
                }
            }
        }]
    },
    mode: 'development',
    optimization: {
        minimize: false
    }
};
```

按照这样，我们就可以在代码中使用 JSX 语法了。

### 设计组件

1. 添加一个 createElement 函数，该函数接收一个 Class、attribute 和 child 参数。并为这个 Class 添加 property。
2. 处理小写标签（省略）。
3. 处理文本（省略）。

``` js
function createElement(Cls, attributes, ...children){
    let o = new Cls({ timer: {} });

    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }

    for (let child of children) {
        o.appendChild(child);
    }

    return o;
}

class MyComponent {
    constructor(config) {
        this.children = [];
        this.root = document.createElement('div');
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    render() {}

    mount(parent) {
        parent.appendChild(this.root);

        for(let child of this.children) {
            child.mount(this.root);
        }
    }
}

let component = <Div id="a" style="width: 100px; height: 100px; background-color: pink;">
    <Div></Div>
    <Div></Div>
    <Div></Div>
</Div>

component.mount(document.body);
```

## 组件化——轮播组件

### 设计成什么样？

- 定时播放幻灯片
- 可以通过鼠标滑动幻灯片

### 如何设计？

实现细节已在本周文件中，这里只是说一下思路：

1. create
2. update
3. mount

## 加餐——如何写技术博客

以下是我的个人理解：

1. 为什么要写？
2. 写给谁？
3. 怎么写？

## 写在最后

突然发现跟着老师上课写代码神清气爽，倍儿有感觉，以前都像吃瓜群众一样直勾勾的看着老师敲打键盘，直到第十四周才明白老师叫我们上课一定要跟着老师敲一遍的精髓。管它懂不懂思路，只要跟着老师敲一遍，后面理解起来容易懂了，而且课上就能完成作业，课后不需要花太大的功夫。