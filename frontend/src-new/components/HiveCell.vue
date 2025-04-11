<template>
  <svg
    class="hive-cell"
    :class="{
      'center': center,
      'outer': !center,
    }"
    viewBox="0 0 120 103.92304845413263"
    @pointerdown="onClick"
  >
    <polygon
      class="shape"
      points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
      stroke="white"
      stroke-width="7.5"
      :class="{
        'pressed': isPressed,
      }"
      @transitionend="onPressEnd"
    />
    <text
      class="letter"
      x="50%"
      y="50%"
      dy="0.3em"
    >
      {{ letter }}
    </text>
  </svg>
</template>

<script>
import EventBus from '@/event-bus';

export default {
  name: 'HiveCell',

  props: {
    letter: {
      type: String,
      required: true,
    },
    center: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isPressed: false,
    };
  },

  mounted() {
    EventBus.$on('letterKeyPress', this.onLetterKeyPress);
  },

  destroyed() {
    EventBus.$off('letterKeyPress', this.onLetterKeyPress);
  },

  methods: {
    onLetterKeyPress(letter) {
      if (this.letter === letter) {
        this.isPressed = true;
      }
    },

    onClick() {
      this.isPressed = true;
      this.$store.commit('addInputLetter', this.letter);
    },

    onPressEnd() {
      this.isPressed = false;
    },
  },
};
</script>

<style scoped>
.hive-cell {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.shape {
  fill: var(--color-muted);
  transform-origin: center center;
  transition:
    transform 0.075s,
    fill 0.075s;
}

.shape.pressed {
  transform: scale(0.85);
  fill: var(--color-muted-dark);
}


.letter {
  text-anchor: middle;
  font-weight: var(--weight-bold);
  font-size: 36px;
  text-transform: uppercase;
  user-select: none;
  pointer-events: none;
}

.center .shape {
  fill: var(--color-primary);
}
</style>
