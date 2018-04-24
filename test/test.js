const TimeSequence = require('../src')

let prev=0
let arr = Array(20).fill(100)
arr = arr.map((x,i)=>x+i*100)
let a = new TimeSequence(arr, {
  isAbs:1,
  canSkip: true,
  onTime: (c,skip)=>{
    const [start, delay] = c.currentJob
    console.log(start, delay, prev-start, c.elapsed, c.real, +new Date)
    prev = start
    if(skip) return
    eval(`const arr = []
    for(let i=0;i<1000;i++){
      arr.push(i)
    }`)
  },
  onEnd: ()=>{
    console.log('end')
  }
})

setTimeout(() => {
  a.pause()
}, 550)

setTimeout(() => {
  a.play()
}, 1600)

require('http').createServer().listen(9999)
