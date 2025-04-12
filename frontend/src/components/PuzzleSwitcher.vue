<template>
  <div class="switcher">
    <button
      v-visible="puzzleOrderIndex !== 0"
      class="nav-button"
      @click="prev"
    >
      <svg class="icon" width="19" height="28" viewBox="0 0 19 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.810017 15.4142C-0.0623233 14.6332 -0.0623233 13.3668 0.810017 12.5858L14.2126 0.585787C15.085 -0.195262 16.4993 -0.195262 17.3716 0.585787C18.244 1.36683 18.244 2.63317 17.3716 3.41421L5.54855 14L17.3716 24.5858C18.244 25.3668 18.244 26.6332 17.3716 27.4142C16.4993 28.1953 15.085 28.1953 14.2126 27.4142L0.810017 15.4142Z" fill="black"/>
      </svg>
    </button>

    <div class="name">
      {{ puzzleDate }}
    </div>
    <button
      v-visible="puzzleOrderIndex !== puzzleOrder.length - 1"
      class="nav-button nav-button-reverse"
      @click="next"
    >
      <svg class="icon" width="19" height="28" viewBox="0 0 19 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.7225 12.5858C18.5948 13.3668 18.5948 14.6332 17.7225 15.4142L4.31986 27.4142C3.44752 28.1953 2.03317 28.1953 1.16084 27.4142C0.288495 26.6332 0.288494 25.3668 1.16083 24.5858L12.9839 14L1.16084 3.41421C0.288495 2.63316 0.288495 1.36683 1.16084 0.585785C2.03317 -0.195263 3.44752 -0.195263 4.31986 0.585786L17.7225 12.5858Z" fill="black"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const store = useStore()

// State
const puzzles = computed(() => store.puzzles)
const puzzleId = computed(() => store.puzzleId)
const puzzleOrder = computed(() => store.puzzleOrder)

// Getters
const puzzle = computed(() => store.puzzle)
const puzzleOrderIndex = computed(() => store.puzzleOrderIndex)

// Computed
const puzzlesArray = computed(() => {
  return Object.values(puzzles.value).map(puzzle => puzzle.id)
})

const puzzleIndex = computed(() => {
  return puzzlesArray.value.indexOf(puzzleId.value)
})

const puzzleDate = computed(() => {
  // puzzle.date example: "2020-10-03T07:00:00.000Z"
  const year = puzzle.value.date.substr(0, 4)
  const month = parseInt(puzzle.value.date.substr(5, 2))
  const day = parseInt(puzzle.value.date.substr(8, 2))
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`
})

// Methods
const next = () => {
  emit('switch', puzzleOrder.value[puzzleOrderIndex.value + 1])
}

const prev = () => {
  emit('switch', puzzleOrder.value[puzzleOrderIndex.value - 1])
}

const emit = defineEmits(['switch'])
</script>

<style scoped>
.switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  border: var(--border);
  border-radius: var(--radius);
  height: 32px;
}

.name {
  padding: 6px;
}

.nav-button {
  height: 30px;
  border: 0;
  padding: 0 24px 0 6px;
  border-radius: var(--radius);
}

.nav-button-reverse {
  padding: 0 6px 0 24px;
}

.icon {
  width: 14px;
  height: 14px;
}

@media (min-width: 640px) {
  .switcher {
    margin-bottom: var(--gutter);
  }
}
</style> 