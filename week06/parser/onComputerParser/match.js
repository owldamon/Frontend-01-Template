//思路: 将match传进去的字符串 进行切割 切割出来的每个字符串便是一个状态机
function end () {
    return end
  }
  
  
  function formatReg(str) {
    const functions = []
    const charList = str.split('')
  
    let start
  
    charList.forEach((c, i) => {
      if (i === 0) {
        start = function (input) {
          if (input === c) {
            if (i === charList.length - 1) {
              return end
            } else {
              return i + 1
            }
          } else {
            return start
          }
        }
      }
  
      functions.push(i === 0 ? start : function (input) {
        if (input === c) {
          if (i === charList.length - 1) {
            return end
          } else {
            return i + 1
          }
        } else {
          return start(input)
        }
      })
    })
  
    
    return class Match {
      constructor() {
        this.functions = functions
        this.start = functions[0]
        this.end = end
      }
  
      match (str) {
        let state = this.start
  
        for (let c of str) {
          state = typeof state(c) === 'number' ? functions[state(c)] : state(c)
        }
  
        return state === this.end
      }
    }
  }
  
  function match(reg, target) {
    const match = new (formatReg(reg))
    console.log(match)
    return match.match(target)
  }

  console.log(match('ababx', 'ababx')) // false