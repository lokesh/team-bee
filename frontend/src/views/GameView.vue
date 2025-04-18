<template>
  <div
    v-if="userProgressDataLoaded"
    class="view"
  >
    <div class="col-gameboard">
      <div class="row-switcher">
        <puzzle-switcher
          class="puzzle-switcher"
          @switch="switchPuzzle"
        />
        <router-link
          to="/"
          class="user-switcher-button"
        >
          <icon-button
            icon="user"
          />
        </router-link>
      </div>

      <scoreboard-mini class="scoreboard-mini" />

      <hive-input class="hive-input" />
      <div class="hive-positioner">
        <div class="hive-sizer">
          <hive />
        </div>
      </div>
      <hive-actions class="hive-actions" />
    </div>
    <scoreboard
      class="col-scoreboard"
      :class="{ 'modal': modal === 'scoreboard' }"
    />
  </div>
  <page-spinner v-else />
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/stores'
import Hive from '@/components/Hive.vue'
import HiveActions from '@/components/HiveActions.vue'
import HiveInput from '@/components/HiveInput.vue'
import IconButton from '@/components/IconButton.vue'
import PageSpinner from '@/components/PageSpinner.vue'
import PuzzleSwitcher from '@/components/PuzzleSwitcher.vue'
import Scoreboard from '@/components/Scoreboard.vue'
import ScoreboardMini from '@/components/ScoreboardMini.vue'
import emitter from '@/eventBus'

const store = useStore()

const userProgressDataLoaded = computed(() => store.userProgressDataLoaded)
const modal = computed(() => store.modal)

const onKey = (e) => {
  // Note: Enter key is handled in HiveInput.vue
  if (e.keyCode === 8 || e.keyCode === 46) {  // Backspace and Delete
    store.removeInputLetter()

  } else if (e.keyCode > 64 && e.keyCode < 91) { // A-Z
    emitter.emit('letterKeyPress', e.key.toLocaleLowerCase())
    store.addInputLetter(e.key)

  } else if (e.keyCode === 32) { // Space
    e.preventDefault() // Don't scroll page down
    store.shuffleOuterLetters()

  } else if (e.keyCode === 27) { // Esc
    router.push({ name: 'Login' })
  }
}

const switchPuzzle = async (puzzleId) => {
  await store.switchPuzzle(puzzleId)
}

onMounted(async () => {
  document.addEventListener('keydown', onKey)
  // Switch to puzzle, either selected or newest
  const puzzleId = store.puzzleId ? store.puzzleId : store.newestPuzzle.id
  await store.switchPuzzle(puzzleId)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.view {
  user-select: none;
}
.col-gameboard {
  padding: var(--gutter);
}

.col-scoreboard {
  display: none;
}

.col-scoreboard.modal {
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.row-switcher {
  display: flex;
}

.puzzle-switcher {
  flex: 1 1 auto;
  margin-bottom: var(--gutter);
}

.user-switcher-button {
  margin-left: var(--gutter);
}

.hive-input {
  margin-bottom: calc(var(--gutter) * 2);
}

.hive-positioner {
  display: flex;
  justify-content: center;
  margin-bottom: calc(var(--gutter) * 2);
}

.hive-sizer {
  flex: 1 1 auto;
  max-width: 250px;
}

@media (min-width: 640px) {
  .view {
    display: flex;
  }

  .col-gameboard {
    flex: 0 0 420px;
    /* The scoreboard has a padding left that already creates the gutter */
    padding-right: 0;
  }

  .user-switcher-button {
    display: none;
  }

  .scoreboard-mini {
    display: none;
  }

  .hive-wrapper {
    max-width: auto;
  }

  .col-scoreboard {
    display: block;
    flex: 1 1 auto;
  }

  .col-scoreboard.modal {
    position: static;
  }
}
</style>
