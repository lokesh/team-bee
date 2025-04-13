<template>
  <div class="page">
    <div class="debug-info">
      <div v-for="item in debugItems" :key="item" class="debug-item">
        <span class="label">{{ formatLabel(item) }}:</span>
        <span class="value">{{ store[item] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '@/stores'

const store = useStore()

const debugItems = [
  // State values
  'userId',
  'puzzleId',
  'input',
  'modal',
  'isLoading',
  'isReady',
  
  // Getters
  'userProgressDataLoaded',
  'user',
  'puzzle',
  'puzzleOrderIndex',
  'newestPuzzle',
  'teamMode',
  'hint',
  'revealed',
  'foundWords',
  'teamFoundWords',
  'letters',
  'points',
  'teamPoints',
  'pointsForGenius',
  'possiblePoints'
]

const formatLabel = (key) => {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
}
</script>

<style scoped>
.page {
  /* padding: var(--gutter); */
  text-align: center;
  font-family: monospace;
  font-size: 12px;
}

.debug-info {
  /* margin-top: 2rem; */
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* align-items: center; */
}

.debug-item {
  display: flex;
  gap: 4px;
  align-items: center;
}

.label {
  font-weight: bold;
  min-width: 100px;
  text-align: right;
}

.value {
  padding: 2px 4px;
  background: #f0f0f0;
  border-radius: 4px;
  text-align: left;
}
</style> 