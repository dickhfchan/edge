<template>
  <div class="input-group input-group--dirty input-group--slider TwoEndSlider">
    <div class="values">
      <div class="start-value value">
        {{Math.round(value[0])}}
      </div>
      <div class="end-value value">
        {{Math.round(value[1])}}
      </div>
    </div>
    <div class="slider">
      <div class="slider__track__container">
        <div class="slider__track" style="transform: scaleX(1) translateX(8px);" ref="greyTrack"></div>
        <div class="slider__track-fill" :style="{left: startLeftDistancePercent*100+'%', transform: `scaleX(${valueLengthPercent}) translateX(0px)`}"></div>
      </div>
      <div class="slider__thumb-container" :style="{left: startLeftDistancePercent*100+'%'}" @mousedown="dragStart($event, 'left')" :title="value[0]">
        <div class="slider__thumb" :class="{dragging: left.dragging}"></div>
      </div>
      <div class="slider__thumb-container" :style="{left: endLeftDistancePercent*100+'%'}" @mousedown="dragStart($event, 'right')" :title="value[1]">
        <div class="slider__thumb" :class="{dragging: right.dragging}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {onDOM, offDOM, addClass, removeClass} from 'helper-js'
export default {
  // components:
  props: {
    min: {},
    max: {},
    value: {},
  },
  data() {
    return {
      left: {
        dragging: false,
      },
      right: {
        dragging: false,
      },
    }
  },
  computed: {
    start() {return this.value[0]},
    end() {return this.value[1]},
    startLeftDistancePercent() {
      return (this.value[0] - this.min) / (this.max - this.min)
    },
    endLeftDistancePercent() {
      return (this.value[1] - this.min) / (this.max - this.min)
    },
    valueLengthPercent() {
      return (this.value[1] - this.value[0]) / (this.max - this.min)
    },
  },
  methods: {
    dragStart(e, type) {
      this[type].dragging = true
      this.whenDragStart = {
        mousePosition: {
          x: e.pageX,
          y: e.pageY,
        },
        value: this.value.slice(0),
        startLeftDistancePercent: this.startLeftDistancePercent,
        valueLengthPercent: this.valueLengthPercent,
      }
      this.movePointType = type
      this.trackWidth = this.$refs.greyTrack.offsetWidth
      this.rangeLength = this.max - this.min

      addClass(document.body, 'no-user-select')

      this.mousemoveWrapped = (e) => {
        this.mousemove(e)
      }
      this.mouseupWrapped = (e) => {
        removeClass(document.body, 'no-user-select')
        offDOM(document, 'mousemove', this.mousemoveWrapped)
        offDOM(document, 'mouseup', this.mouseupWrapped)
        this[type].dragging = false
      }
      onDOM(document, 'mousemove', this.mousemoveWrapped)
      onDOM(document, 'mouseup', this.mouseupWrapped)
    },
    mousemove(e) {
      const {mousePosition, value, startLeftDistancePercent, valueLengthPercent} = this.whenDragStart
      const move = e.pageX - mousePosition.x
      let movePercent = move / this.trackWidth
      const {rangeLength} = this
      if (this.movePointType === 'left') {
        // left
        if (move < 0) {
          if (-movePercent > startLeftDistancePercent) {
            movePercent = -startLeftDistancePercent
          }
        } else {
          if (movePercent > valueLengthPercent) {
            movePercent = valueLengthPercent
          }
        }
        this.$set(this.value, 0, value[0] + rangeLength * movePercent)
      } else {
        // right
        if (move < 0) {
          if (-movePercent > valueLengthPercent) {
            movePercent = -valueLengthPercent
          }
        } else {
          const restPercent = 1 - startLeftDistancePercent - valueLengthPercent
          if (movePercent > restPercent) {
            movePercent = restPercent
          }
        }
        this.$set(this.value, 1, value[1] + rangeLength * movePercent)
      }
    },
  },
}
</script>

<style>
/* global */
.no-user-select{
  user-select: none;
}
</style>

<style lang="scss">
.TwoEndSlider{
  user-select: none;
  flex-direction: column;
  .values{
    .value{
      color: #232323;
    }
    .start-value{
      float: left;
    }
    .end-value{float: right;}
  }
  .slider__track, .slider__track-fill{
    transition: none;
  }
  .slider__thumb-container{
    transition: none;
  }

  .slider__thumb{
    cursor: pointer;
    &.dragging{
      transform: translateY(-50%) scale(1.2);
      transition: none;
    }
  }
}
</style>
