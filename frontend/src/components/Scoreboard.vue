<template>
  <div class="scoreboard">
    <div class="scoreboard-header">
      <h2>Scoreboard</h2>
      <div class="scoreboard-controls">
        <segmented-control
          v-model="viewMode"
          :options="viewOptions"
        />
      </div>
    </div>

    <div class="scoreboard-content">
      <div
        v-if="viewMode === 'individual'"
        class="scoreboard-list"
      >
        <div
          v-for="user in sortedUsers"
          :key="user.id"
          class="scoreboard-item"
        >
          <div class="scoreboard-item-info">
            <div class="scoreboard-item-name">
              {{ user.name }}
            </div>
            <div class="scoreboard-item-points">
              {{ user.points }} pts
            </div>
          </div>
          <genius-bar
            :points="user.points"
            :possible-points="possiblePoints"
          />
        </div>
      </div>

      <div
        v-else
        class="scoreboard-list"
      >
        <div
          v-for="team in sortedTeams"
          :key="team.id"
          class="scoreboard-item"
        >
          <div class="scoreboard-item-info">
            <div class="scoreboard-item-name">
              {{ team.name }}
            </div>
            <div class="scoreboard-item-points">
              {{ team.points }} pts
            </div>
          </div>
          <genius-bar
            :points="team.points"
            :possible-points="possiblePoints"
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

const viewMode = ref('individual')

const viewOptions = [
  { label: 'Individual', value: 'individual' },
  { label: 'Teams', value: 'teams' }
]

const possiblePoints = computed(() => store.possiblePoints)

const sortedUsers = computed(() => {
  return [...store.users]
    .sort((a, b) => b.points - a.points)
})

const sortedTeams = computed(() => {
  const teams = {}
  
  store.users.forEach(user => {
    if (!teams[user.teamId]) {
      teams[user.teamId] = {
        id: user.teamId,
        name: user.teamName,
        points: 0
      }
    }
    teams[user.teamId].points += user.points
  })
  
  return Object.values(teams)
    .sort((a, b) => b.points - a.points)
})
</script>

<style scoped>
.scoreboard {
  padding: var(--gutter);
}

.scoreboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--gutter);
}

.scoreboard-content {
  max-height: 400px;
  overflow-y: auto;
}

.scoreboard-list {
  display: flex;
  flex-direction: column;
  gap: var(--gutter);
}

.scoreboard-item {
  padding: var(--gutter);
  border: var(--border);
  border-radius: var(--radius);
}

.scoreboard-item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.scoreboard-item-name {
  font-weight: 500;
}

.scoreboard-item-points {
  color: var(--color-muted);
}
</style> 