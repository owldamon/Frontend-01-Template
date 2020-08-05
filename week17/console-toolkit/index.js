// 1
// const tty = require('tty');
// const ttys = require('ttys');
// const rl = require('readline');

const { resolve } = require("upath");

// const stdin = ttys.stdin;
// const stdout = ttys.stdout;

// stdout.write("Hello world!\n");
// stdout.write("\033[1A");
// stdout.write("bye  \n");

// 2

// var stdin = process.stdin;

// stdin.setRawMode( true );
// stdin.resume();
// stdin.setEncoding( 'utf8' );

// stdin.on('data', function( key ){
//   if( key === '\u0003' ){
//     process.exit();
//   }

//   process.stdin.write( key.toString().charCodeAt(0).toString() );
// })

var stdin = process.stdin;
var stdout = process.stdout;

stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );

function getChar(){
  return new Promise(resolve => {
    stdin.on( 'data', function( key ){
      resolve(key)
    })
  })
}

function up(n = 1){
  stdout.write('\033[' + n + 'A')
}

function down(n = 1){
  stdout.write('\033[' + n + 'B')
}

function right(n = 1){
  stdout.write('\033[' + n + 'C')
}

function left(n = 1){
  stdout.write('\033[' + n + 'D')
}

void async function(){
  stdout.write('请选择你想使用的框架：\n');
  let ans = await select(['vue', 'react', 'ng']);
  stdout.write('\n我选' + ans + '-v-! \n');
  process.exit();
}();


async function select(choices) {
  let selected = 0;
  for(let i = 0; i < choices.length; i++){
    let choice = choices[i];
    if( i === selected){
      stdout.write('[*]' + choice + '\n');
    }else{
      stdout.write('[ ]' + choice + '\n');
    }
  }

  up(choices.length);
  right();

  while(true){
    let char = await getChar();
    if(char === '\u0003') {
      process.exit();
      break;
    }

    if(char === 'w' && selected > 0){
      stdout.write(" ")
      left()
      selected --;
      up()
      stdout.write('*')
      left();
    }

    if(char === 's' && selected < choices.length - 1){
      stdout.write(" ")
      left()
      selected ++;
      down()
      stdout.write('*')
      left();
    }

    if(char === '\r') {
      down(choices.length - selected)
      left()
      return choices[selected];
    }
    
  }



}