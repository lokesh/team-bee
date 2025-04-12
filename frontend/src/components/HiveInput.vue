<template>
  <div class="wrapper">
    <div
      ref="notice"
      class="notice"
      @animationend="onNoticeEnd"
      v-html="noticeMsg"
    >
    </div>
    <div
      ref="input"
      class="input"
      @animationend="onShakeEnd"
    >
      <span
        v-for="(letter, i) in inputLetters"
        :key="i"
        class="letter"
        :class="{
          'letter': true,
          'letter--center': letter === centerLetter,
          'letter--invalid': !letters.includes(letter),
        }"
       >
        {{ letter }}
      </span>
      <span class="caret" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/stores'
import { calcPoints, isPangram } from '@/utils'
import emitter from '@/eventBus'

const store = useStore()
const notice = ref(null)
const input = ref(null)
const noticeMsg = ref('')

const inputLetters = computed(() => store.input.split(''))
const puzzle = computed(() => store.currentPuzzle)
const foundWords = computed(() => store.foundWords)

const centerLetter = computed(() => store.puzzle?.center_letter)
const outerLetters = computed(() => store.puzzle?.outer_letters)
const letters = computed(() => [centerLetter.value, ...outerLetters.value])

const onKey = (e) => {
  console.log('onKey', e.keyCode)
  if (e.keyCode !== 13) return
  submit()
}

const showNotice = (str) => {
  noticeMsg.value = str
  notice.value.classList.add('notice--visible')
}

const onNoticeEnd = () => {
  notice.value.classList.remove('notice--visible')
}

const onShakeEnd = () => {
  input.value.classList.remove('input--error')
  store.clearInputLetters()
}

const shake = () => {
  input.value.classList.add('input--error')
}

const submit = () => {
  const currentInput = store.input.value.join('')
  
  // Used a wrong letter
  if (!currentInput.split('').every(letter => letters.value.includes(letter))) {
    showNotice('Wrong letters')
    shake()
  } else if (currentInput.length < 4) {
    // Too short
    showNotice('Too short')
    shake()
  } else if (!currentInput.includes(centerLetter.value)) {
    // Missing center letter
    showNotice('Missing center letter')
    shake()
  } else if (foundWords.value.includes(currentInput)) {
    // Already found
    showNotice('Already found')
    shake()
  } else if (!puzzle.value.answers.includes(currentInput)) {
    // Not in word list
    showNotice('Not in word list')
    shake()
  } else {
    // Good!
    let points = calcPoints([currentInput])
    let str = isPangram(currentInput) ? 'Pangram! ' : ''
    showNotice(`${str} +${points}`)

    store.addFoundWord(currentInput)
    store.clearInputLetters()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  emitter.on('submitInput', submit)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  emitter.off('submitInput', submit)
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notice {
  position: absolute;
  display: inline-block;
  opacity: 0;
  padding: 8px 12px;
  color: white;
  background: var(--color-bg-dark);
  border-radius: var(--radius);
  pointer-events: none;
  text-align: center;
  user-select: none;
}

.notice--visible {
  animation: fade-in-out 1.5s;
}

.input {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  font-size: 36px;
  font-weight: var(--weight-bold);
  line-height: 1;
  letter-spacing: 0.025em;
  text-align: center;
  text-transform: uppercase;
  user-select: none;
}

.input--error {
  animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both
}

.letter--center {
  color: var(--color-primary);
}

.letter--invalid {
  color: var(--color-muted);
}

.caret {
  width: 4px;
  height: 1em;
  background: var(--color-primary);
  animation: blink 1.0s cubic-bezier(.215,.61,.355,1) forwards infinite;
}

@keyframes shake {
    10%, 90% {
        transform: translate3d(-1px, 0, 0)
    }
    20%, 80% {
        transform: translate3d(2px, 0, 0)
    }
    30%, 50%, 70% {
        transform: translate3d(-4px, 0, 0)
    }
    40%, 60% {
        transform: translate3d(4px, 0, 0)
    }
}

@keyframes fade-in-out {
    0% {
        opacity: 0;
    }
    20%,
    80% {
        opacity: 1;
    }
    100% {
      opacity: 0;
    }
}

@keyframes blink {
    from,to {
        opacity: 1
    }
    50% {
        opacity: 0
    }
}
</style> 