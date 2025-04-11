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
import { useStore } from '@/stores'
import GeniusBar from '@/components/GeniusBar.vue'

const store = useStore()

const displayPoints = computed(() => {
  return store.teamMode ? store.teamPoints : store.points
})

const points = computed(() => store.points || 0)
const possiblePoints = computed(() => store.possiblePoints)

const openScoreboard = () => {
  store.openModal('scoreboard')
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