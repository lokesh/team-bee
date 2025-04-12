<template>
  <div class="hive">
    <hive-cell
      v-for="(letter, i) in outerLetters"
      :key="i"
      :letter="letter"
      class="cell"
    />
    <hive-cell
      :letter="centerLetter"
      center
      class="cell"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores'
import HiveCell from './HiveCell.vue'

const store = useStore()

const centerLetter = computed(() => store.puzzle?.center_letter)
const outerLetters = computed(() => store.puzzle?.outer_letters)
</script>

<style scoped>
.hive {
	position: relative;
  width: 100%;
  padding-bottom: 100%;
}

.cell {
  /* Center it */
  position: absolute;
  top: calc(100% / 3);
  left: 30%;

  /* Size it */
  width: 40%;
  height: calc(100% / 3);

  cursor: pointer;
}

/* Now that each cell is centered, shifting them to the correct position
becomes easier. */
.cell:nth-child(1) {
  transform: translate(-75%, -50%);
}

.cell:nth-child(2) {
  transform: translate(0, -100%);
}

.cell:nth-child(3) {
  transform: translate(75%, -50%);
}

.cell:nth-child(4) {
  transform: translate(75%, 50%);
}

.cell:nth-child(5) {
  transform: translate(0, 100%);
}

.cell:nth-child(6) {
  transform: translate(-75%, 50%);
}
</style> 