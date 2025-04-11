<template>
  <div class="button-row">
    <hive-button
      class="button-row-button"
      @click="onDelete"
    >
      Delete
    </hive-button>
    <hive-button
      class="button-row-button"
      @click="onShuffle"
    >
      Shuffle
    </hive-button>
    <hive-button
      class="button-row-button"
      @click="onEnter"
    >
      Enter
    </hive-button>
  </div>
</template>

<script setup>
import { usePuzzleStore } from '@/stores/puzzle'
import EventBus from '@/event-bus'
import HiveButton from './HiveButton.vue'

const puzzleStore = usePuzzleStore()

const onDelete = () => {
  puzzleStore.removeInputLetter()
}

const onEnter = () => {
  EventBus.$emit('submitInput')
}

const onShuffle = () => {
  puzzleStore.shuffleOuterLetters()
}
</script>

<style scoped>
.button-row {
  display: flex;
  justify-content: center;
}

.button-row-button {
  margin-right: var(--gutter);
}

.button-row-button:last-of-type {
  margin-right: 0;
}
</style> 