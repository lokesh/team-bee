<template>
  <div>
    User Id: {{ userId }}<br />
    Puzzle Id: {{ puzzleId }}<br />
    Puzzle Order: {{ puzzleOrder }}<br />
    Puzzle Order Length: {{ puzzleOrder.length }}<br />
    Puzzle Order Index: {{ puzzleOrderIndex }}<br />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from '@/stores'

const store = useStore()

const puzzles = computed(() => store.puzzles)
const puzzleOrder = computed(() => store.puzzleOrder)
const puzzleId = computed(() => store.currentPuzzleId)
const userId = computed(() => store.userId)
const puzzleOrderIndex = computed(() => store.puzzleOrderIndex)

onMounted(() => {
  console.log(puzzles.value)
})
</script>

<style scoped>
/* Add any necessary styles */
</style> 