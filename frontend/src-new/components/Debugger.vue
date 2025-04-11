<template>
  <div>
    Puzzle Id: {{  puzzleId }}<br />
    Puzzle Order: {{  puzzleOrder }}<br />
    Puzzle Order Length: {{  puzzleOrder.length }}<br />
    Puzzle Order Index: {{  puzzleOrderIndex }}<br />
    <!-- {{ puzzles[1].date }}<br /> -->
    <!-- {{ puzzles[1].date }}<br />
    {{ puzzles[2].date }}<br /> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'Debugger',

  computed: {
    ...mapState([
      'puzzles',
      'puzzleOrder',
      'puzzleId',
      'userId',
      'modal',
    ]),

    ...mapGetters([
      'userProgressDataLoaded',
      'newestPuzzle',
      'puzzleOrderIndex',
    ]),
  },

  mounted() {
    console.log(this.puzzles);
  },

}
</script>

<style scoped>

</style>
