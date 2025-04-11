<template>
  <div>
    Puzzle Id: {{ puzzleId }}<br />
    Puzzle Order: {{ puzzleOrder }}<br />
    Puzzle Order Length: {{ puzzleOrder.length }}<br />
    Puzzle Order Index: {{ puzzleOrderIndex }}<br />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePuzzleStore } from '@/stores/puzzle'
import { useUserStore } from '@/stores/user'

const puzzleStore = usePuzzleStore()
const userStore = useUserStore()

const puzzles = computed(() => puzzleStore.puzzles)
const puzzleOrder = computed(() => puzzleStore.puzzleOrder)
const puzzleId = computed(() => puzzleStore.currentPuzzleId)
const userId = computed(() => userStore.currentUserId)
const puzzleOrderIndex = computed(() => puzzleStore.puzzleOrderIndex)

onMounted(() => {
  console.log(puzzles.value)
})
</script>

<style scoped>
/* Add any necessary styles */
</style> 