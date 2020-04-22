UTF8 Encoding函数
```
function UTF8Encoding(str) {
  return str && str
    .split('')
    .map((s) => `\\u${s.charCodeAt().toString(16)}`)
    .join('') || ''
}
```