<template>
  <div class="wrapper">
    <div class="scoreboard">
      <div class="user-bar">
        <segmented-control
          :value="teamMode"
          :options="[
              { label: 'Solo', value: false },
              { label: 'Team', value: true },
          ]"
          class="team-control"
          @input="toggleSetting('teamMode')"
        />
        <router-link
            class="text-button user-switcher"
            to="/"
          >
          Switch user
        </router-link>

        <icon-button
          class="close-button"
          icon="x"
          radius="small"
          @click="closeModal"
        />
      </div>

      <div
        class="msg-score"
      >
        <template v-if="displayFoundWordsCount === 1">
          <span class="desktop-inline">1 word and </span>{{ displayPoints }} pts
        </template>
        <template v-else>
          <span class="desktop-inline">{{ displayFoundWordsCount}} words and </span>{{ displayPoints }} pts
        </template>
      </div>
      <div
        v-if="false"  
        class="msg-max"
      >
        {{ puzzle.answers.length }} words and {{ possiblePoints }} pts max
      </div>

      <genius-bar
        class="genius-bar"
        :points="displayPoints"
        :possible-points="possiblePoints"
      />

      <div class="list">
        <div
          v-for="row in displayList"
          :key="row.word"
          class="list-row"
        >
          <div
            :class="{ 'hint': hintCheck(row.word) }"
          >
          {{ row.word }}
          </div>

          <div
            class="tags"
            v-if="teamMode && !hintCheck(row.word)"
          >
            <user-tag
              v-for="user in puzzleProgress"
              :user-id="user.user_id"
              :key="`user-${user.user_id}`"
              class="tag"
              v-visible="row.users.includes(user.user_id)"
              :class="getTagClasses(user.user_id, usersWithProgress, row.users)"
            />
          </div>
        </div>
      </div>

      <div class="hint-bar">
        <button
          class="hint-button"
          :class="{ 'toggled': hint }"
          @click="toggleSetting('hint')"
        >
          Hints
        </button>
        <button
          v-if="false"
          class="hint-button"
          :class="{ 'toggled': revealed }"
          @click="toggleSetting('revealed')"
        >
          Reveal answers
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores'
import GeniusBar from '@/components/GeniusBar.vue'
import IconButton from '@/components/IconButton.vue'
import SegmentedControl from '@/components/SegmentedControl.vue'
import UserTag from '@/components/UserTag.vue'

const store = useStore()

// Computed properties
const foundWords = computed(() => store.foundWords)
const teamFoundWords = computed(() => store.teamFoundWords)
const hint = computed(() => store.hint)
const points = computed(() => store.points)
const teamPoints = computed(() => store.teamPoints)
const possiblePoints = computed(() => store.possiblePoints)
const puzzle = computed(() => store.puzzle)
const revealed = computed(() => store.revealed)
const teamMode = computed(() => store.teamMode)
const puzzleProgress = computed(() => store.puzzleProgress)
const users = computed(() => store.users)
const userId = computed(() => store.userId)

const displayPoints = computed(() => teamMode.value ? teamPoints.value : points.value)

const displayFoundWordsCount = computed(() => teamMode.value ? teamFoundWords.value.length : foundWords.value.length)

const usersWithProgress = computed(() => Object.keys(puzzleProgress.value).map(id => parseInt(id)))

const list = computed(() => {
  return [...puzzle.value.answers].sort().map(word => {
    let users = []
    Object.entries(puzzleProgress.value).forEach(([userId, progress]) => {
      if (progress.found_words.includes(word)) {
        users.push(parseInt(userId))
      }
    })
    return {
      word,
      users,
    }
  })
})

const soloList = computed(() => {
  return list.value.filter(row => {
    return row.users.includes(userId.value)
  })
})

const teamList = computed(() => {
  return list.value.filter(row => {
    return row.users.length
  })
})

const displayList = computed(() => {
  // If hints or reveal, show all
  if (hint.value || revealed.value) {
    return list.value
  } else {
    // If team, show team finds.
    // If solo, show user finds.
    if (teamMode.value) {
      return teamList.value
    } else {
      return soloList.value
    }
  }
})

const userName = computed(() => users.value[userId.value].name)

// Methods
const closeModal = () => {
  store.closeModal();
}

const getTagClasses = (currentUser, allUsers, usersWithTags) => {
  const index = allUsers.indexOf(currentUser)
  const prevUser = allUsers[index - 1]
  const nextUser = allUsers[index + 1]

  // The left and right rounding classes are inverted because the tags are
  // displayed with flex-direction: reverse
  return {
    'right-rounded': (index === 0 || !usersWithTags.includes(prevUser)),
    'left-rounded': (index === allUsers.length - 1 || !usersWithTags.includes(nextUser))
  }
}

const toggleSetting = (setting) => {
  store.toggleSetting(setting);
}

const hintCheck = (word) => {
  if (revealed.value) {
    return false
  } else if (teamMode.value) {
    return !teamList.value.find(row => row.word === word)
  } else {
    return !soloList.value.find(row => row.word === word)
  }
}
</script>

<style scoped>
.wrapper {
  padding: var(--gutter);
  background: white;
}

.scoreboard {
  padding: var(--gutter);
  border: var(--border);
  border-radius: var(--radius);
}

.user-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--gutter);
}

.user-switcher {
  display: none;
}

.msg-score {
  margin-bottom: calc(var(--gutter) / 3);
}

.msg-max {
  line-height: 1;
  margin-bottom: calc(var(--gutter) / 2);
  color: var(--color-secondary);
}

.genius-bar {
  margin-bottom: calc(var(--gutter) / 2);
}

.list {
  display: flex;
  height: 58vh;
  margin-bottom: var(--gutter);
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-x: auto;
  user-select:text;
}

.list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 8em;
  padding: 0.4em 0;
  margin-right: var(--gutter);
  border-bottom: var(--divider);
  font-size: 18px;
  text-transform: capitalize;
}

.tags {
  display: flex;
  flex-direction: row-reverse;
  margin-left: var(--gutter);
}

.tag.right-rounded {
  border-top-right-radius: var(--radius-sm);
  border-bottom-right-radius: var(--radius-sm);
}

.tag.left-rounded {
  border-top-left-radius: var(--radius-sm);
  border-bottom-left-radius: var(--radius-sm);
}


.hint {
  background: var(--color);
  border-radius: var(--radius-sm);
}

.hint-bar {
  display: flex;
  justify-content: space-between;
}

.hint-button {
  position: relative;
  left: -4px;
  padding: 4px 8px;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--color-secondary);
}

.hint-button:hover {
  color: var(--color);
  background-color: var(--color-muted);
}

.hint-button.toggled {
  color: var(--color);
  background-color: var(--color-primary);
}

@media (min-width: 640px) {
  .user-switcher {
    display: block;
  }

  .close-button {
    display: none;
  }

  .list {
    display: flex;
  }
}
</style>
