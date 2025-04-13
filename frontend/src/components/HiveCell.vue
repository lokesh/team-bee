<template>
  <svg
    class="hive-cell"
    :class="{
      'center': center,
      'outer': !center,
    }"
    viewBox="0 0 120 103.92304845413263"
    @click="onClick"
  >
    <polygon
      class="shape"
      points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
      stroke="white"
      stroke-width="7.5"
      :class="{
        'pressed': isPressed,
      }"
      @transitionend="onPressEnd"
    />
    <text
      class="letter"
      x="50%"
      y="50%"
      dy="0.3em"
    >
      {{ letter }}
    </text>
  </svg>
</template>

<script setup>
import { ref, onMounted, onUnmounted, } from 'vue'
import { useStore } from '@/stores'
import emitter from '@/eventBus'

const props = defineProps({
  letter: {
    type: String,
    required: true,
  },
  center: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()
const isPressed = ref(false)

const onLetterKeyPress = (pressedLetter) => {
  if (props.letter === pressedLetter) {
    isPressed.value = true
  }
}

const onClick = () => {
  isPressed.value = true
  store.addInputLetter(props.letter)
}

const onPressEnd = () => {
  isPressed.value = false
}

onMounted(() => {
  emitter.on('letterKeyPress', onLetterKeyPress)
})

onUnmounted(() => {
  emitter.off('letterKeyPress', onLetterKeyPress)
})
</script>

<style scoped>
.hive-cell {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.shape {
  fill: var(--color-muted);
  transform-origin: center center;
  transition:
    transform 0.075s,
    fill 0.075s;
}

.shape.pressed {
  transform: scale(0.85);
  fill: var(--color-muted-dark);
}

.letter {
  text-anchor: middle;
  font-weight: var(--weight-bold);
  font-size: 36px;
  text-transform: uppercase;
  user-select: none;
  pointer-events: none;
}

.center .shape {
  fill: var(--color-primary);
}
</style> 