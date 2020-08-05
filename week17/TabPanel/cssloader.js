
const css = require('css');

module.exports = function(src, map) {

  let stylesheet = css.parse(src);

  const name = this.resourcePath.match(/([^/]+).css$/)[1]
  for(let item of stylesheet.stylesheet.rules){
    console.log(item.selectors)
    item.selectors = item.selectors.map(selector => 
      selector.match(new RegExp(`^.${name}`)) ? selector :
      `.carousel ${selector}` )
  }

  return `
  let style = document.createElement("style");
  style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))}
  document.documentElement.appendChild(style);
  `;
  
}