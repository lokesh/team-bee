<template>
  <div>
    User Id: {{ store.userId }}<br />
    Puzzle Id: {{ store.puzzleId }}<br />
    Puzzle Order: {{ store.puzzleOrder }}<br />
    Puzzle Order Length: {{ store.puzzleOrder.length }}<br />
    Puzzle Order Index: {{ store.puzzleOrderIndex }}<br />
    Puzzle Progress: {{ store.puzzleProgress }}<br />
    userProgressDataLoaded: {{ store.userProgressDataLoaded }}<br />
  </div>
</template>

<script setup>
import { useStore } from '@/stores'

const store = useStore()

</script>

<style scoped>
/* Add any necessary styles */
</style> 