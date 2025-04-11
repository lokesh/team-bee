<template>
  <div class="puzzle-switcher">
    <div class="puzzle-switcher-header">
      <h2>Puzzles</h2>
      <div class="puzzle-switcher-controls">
        <segmented-control
          v-model="viewMode"
          :options="viewOptions"
        />
      </div>
    </div>

    <div class="puzzle-switcher-content">
      <div
        v-if="viewMode === 'all'"
        class="puzzle-list"
      >
        <div
          v-for="puzzle in sortedPuzzles"
          :key="puzzle.id"
          class="puzzle-item"
          :class="{ 'is-active': puzzle.id === currentPuzzleId }"
          @click="selectPuzzle(puzzle.id)"
        >
          <div class="puzzle-item-info">
            <div class="puzzle-item-name">
              {{ puzzle.name }}
            </div>
            <div class="puzzle-item-points">
              {{ puzzle.points }} pts
            </div>
          </div>
          <genius-bar
            :points="puzzle.points"
            :possible-points="puzzle.possiblePoints"
          />
        </div>
      </div>

      <div
        v-else
        class="puzzle-list"
      >
        <div
          v-for="puzzle in filteredPuzzles"
          :key="puzzle.id"
          class="puzzle-item"
          :class="{ 'is-active': puzzle.id === currentPuzzleId }"
          @click="selectPuzzle(puzzle.id)"
        >
          <div class="puzzle-item-info">
            <div class="puzzle-item-name">
              {{ puzzle.name }}
            </div>
            <div class="puzzle-item-points">
              {{ puzzle.points }} pts
            </div>
          </div>
          <genius-bar
            :points="puzzle.points"
            :possible-points="puzzle.possiblePoints"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores'
import SegmentedControl from '@/components/SegmentedControl.vue'
import GeniusBar from '@/components/GeniusBar.vue'

const store = useStore()

const viewMode = ref('all')

const viewOptions = [
  { label: 'All', value: 'all' },
  { label: 'Incomplete', value: 'incomplete' }
]

const currentPuzzleId = computed(() => store.currentPuzzleId)
const sortedPuzzles = computed(() => {
  return [...store.puzzles]
    .sort((a, b) => a.order - b.order)
})

const filteredPuzzles = computed(() => {
  return sortedPuzzles.value.filter(puzzle => puzzle.points < puzzle.possiblePoints)
})

const selectPuzzle = (puzzleId) => {
  store.setCurrentPuzzle(puzzleId)
}
</script>

<style scoped>
.puzzle-switcher {
  padding: var(--gutter);
}

.puzzle-switcher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--gutter);
}

.puzzle-switcher-content {
  max-height: 400px;
  overflow-y: auto;
}

.puzzle-list {
  display: flex;
  flex-direction: column;
  gap: var(--gutter);
}

.puzzle-item {
  padding: var(--gutter);
  border: var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.puzzle-item:hover {
  background-color: var(--color-bg-hover);
}

.puzzle-item.is-active {
  border-color: var(--color-primary);
  background-color: var(--color-bg-hover);
}

.puzzle-item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.puzzle-item-name {
  font-weight: 500;
}

.puzzle-item-points {
  color: var(--color-muted);
}
</style> 