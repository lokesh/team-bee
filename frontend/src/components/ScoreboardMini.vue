<template>
  <div
    class="scoreboard-mini"
    @click="openScoreboard"
  >
    <div class="msg-score">
      {{ points }} pts
    </div>
    <genius-bar
      :points="displayPoints"
      :possible-points="possiblePoints"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePuzzleStore } from '@/stores/puzzle'
import GeniusBar from '@/components/GeniusBar.vue'

const puzzleStore = usePuzzleStore()

const displayPoints = computed(() => {
  return puzzleStore.teamMode ? puzzleStore.teamPoints : puzzleStore.points
})

const points = computed(() => puzzleStore.points)
const possiblePoints = computed(() => puzzleStore.possiblePoints)

const openScoreboard = () => {
  puzzleStore.openModal('scoreboard')
}
</script>

<style scoped>
.scoreboard-mini {
  padding: var(--gutter);
  border: var(--border);
  border-radius: var(--radius);
}

.msg-score {
  margin-bottom: 8px;
}
</style> 