
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
    config = this.config = config || {}
    if(config.autoStart) this.next()
  }
  next (already=0) {
    this.isPaused = false
    const {config, seq, index} = this
    const {canSkip, onTime, onEnd, isAbs} = config
    if (index>=seq.length) {
      return onEnd && onEnd(this)
    }
    this.real += already
    const delay = isAbs
      ? index<1 ? 0 : seq[index]-seq[index-1]
      : seq[index]
    const curDelay = this.elapsed + delay - this.real
    const start = Date.now()
    this.currentJob = [start, curDelay]
    const workFn = (skip) => {
      this.elapsed+= delay
      const finishTime = Date.now()
      this.real += finishTime - start
      onTime && onTime(this, skip)
      this.index++
      this.real += Date.now() - finishTime
      this.next()
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
    if(!this.isPaused) return
    const {currentJob, hold} = this
    const before = hold - (currentJob[0]||0)
    this.next(before)
  }
}

module.exports = TimeSequence

