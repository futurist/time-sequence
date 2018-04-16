class TimeSequence {
  constructor (seqArr, config) {
    this.timerIds = []
    this.currentJob = []
    this.paused = true
    this.offset = 0
    this.seq = seqArr
    this.config = config || {}
    this.next(seqArr)
  }
  next (seq) {
    const {config} = this
    const curDelay = seq[0]*1000 - this.offset
    const start = +new Date()
    this.currentJob = [start, curDelay, seq]
    this.timerIds.push(setTimeout(() => {
      config.onTime && config.onTime(curDelay, start, this)
      var remaining = seq.slice(1)
      if (remaining.length) {
        const realDelay = +new Date - start
        this.offset = realDelay - curDelay
        this.next(remaining)
      }
    }, curDelay))
  }
}

let prev=0
new TimeSequence(Array(30).fill(0.1), {
  onTime: (a,b,c)=>{
    console.log(b, b-prev, c.offset)
    prev = b
    eval(`const arr = []
    for(let i=0;i<1000000;i++){
      arr.push(i)
    }`)
  }
})
