<template>
  <div class="hive">
    <hive-cell
      v-for="(letter, i) in puzzle.outer_letters"
      :key="i"
      :letter="letter"
      class="cell"
    />
    <hive-cell
      :letter="puzzle.center_letter"
      center
      class="cell"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HiveCell from './HiveCell.vue';

export default {
  name: 'Hive',

  components: {
    HiveCell,
  },

  computed: {
    ...mapGetters([
      'puzzle',
    ]),
  },
}

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
