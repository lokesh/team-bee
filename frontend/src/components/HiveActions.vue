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
import { useStore } from '@/stores'
import HiveButton from './HiveButton.vue'
import emitter from '@/eventBus'

const store = useStore()

const onDelete = () => {
  store.removeInputLetter()
}

const onEnter = () => {
  emitter.emit('submitInput')
}

const onShuffle = () => {
  console.log('onShuffle')
  store.shuffleOuterLetters()
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