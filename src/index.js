var performance = typeof window !== 'undefined' && window.performance
var hrtime = typeof process !== 'undefined' && process
  && typeof process.hrtime === 'function' && process.hrtime

function now() {
  if(performance!==false) return performance.now()
  else if(hrtime!==false) {
    var t = hrtime()
    return (t[0] + t[1] / 1e9) * 1000
  } else {
    return Date.now()
  }
}

class TimeSequence {
  constructor (seqArr, config) {
    this.timerIds = []
    this.currentJob = []
    this.isPaused = true
    this.offset = 0
    this.elapsed = 0
    this.real = 0
    this.hold = 0
    this.min = 16
    this.index=0
    this.seq = seqArr || []
    this.config = config || {}
    this.next()
  }
  next (already=0) {
    this.isPaused = false
    const {config, seq, index} = this
    const {canSkip, onTime, onEnd} = config
    this.real += already
    const delay = seq[index]
    const curDelay = this.elapsed + delay - this.real
    const start = Date.now()
    this.currentJob = [start, curDelay]
    const workFn = (skip) => {
      this.elapsed+= delay
      const finishTime = Date.now()
      this.real += finishTime - start
      onTime && onTime(this, skip)
      this.index++
      if (this.index<seq.length) {
        this.real += Date.now() - finishTime
        this.next()
      } else {
        onEnd && onEnd(this)
      }
    }
    if(curDelay>this.min) this.timerIds.push(setTimeout(workFn, curDelay))
    else if(!canSkip) workFn()
    else workFn(true)
  }

  pause(){
    this.isPaused = true
    this.hold = Date.now()
    this.timerIds.forEach(clearTimeout)
    this.timerIds = []
  }

  play(){
    const {currentJob, hold} = this
    const before = hold - (currentJob[0]||0)
    this.next(before)
  }
}

module.exports = TimeSequence

