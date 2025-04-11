<template>
    <div
      class="genius-bar"
      :class="{'is-genius': isGenius}"
    >
        <div
          ref="flag"
          class="flag"
          :style="flagStyles"
        >
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0px" y="0px" viewBox="0 0 100 100" xml:space="preserve"><path d="M26.212,73.333c0.293,3.301,0.454,6.631,0.454,10h46.667c0-3.369,0.16-6.699,0.453-10H26.212z"/><path d="M83.333,30c-3.682,0-6.666,2.985-6.666,6.667c0,0.735,0.149,1.436,0.371,2.1l-13.705,4.567l-9.635-14.453  c1.787-1.198,2.969-3.236,2.969-5.547c0-3.682-2.985-6.667-6.667-6.667s-6.667,2.985-6.667,6.667c0,2.311,1.18,4.349,2.969,5.547  l-9.636,14.453l-13.703-4.567c0.221-0.664,0.37-1.364,0.37-2.1c0-3.682-2.987-6.667-6.667-6.667C12.985,30,10,32.985,10,36.667  s2.985,6.667,6.667,6.667c0.896,0,1.745-0.183,2.524-0.502c2.897,7.63,4.995,15.605,6.223,23.835h49.173  c1.227-8.229,3.323-16.205,6.221-23.835c0.781,0.319,1.631,0.502,2.525,0.502c3.682,0,6.667-2.985,6.667-6.667S87.015,30,83.333,30z  "/></svg>

          <div class="flag-points">{{ label }}</div>
        </div>

        <div class="rail">
          <div
            class="rail-fill"
            :style="`transform: scaleX(${percentComplete})`"
          >
          </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { GENIUS_PERCENTAGE_SOLO, GENIUS_PERCENTAGE_TEAM } from '@/utils/constants';

export default {
  name: 'GeniusBar',

  props: {
    points: {
      type: Number,
      required: true,
    },
    possiblePoints: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      flagWidth: 0,
    };
  },

  computed: {
    ...mapGetters([
      'teamMode',
    ]),

    isGenius() {
      return (this.points >= this.geniusPoints);
    },

    geniusPoints() {
      return Math.floor(this.geniusPercent * this.possiblePoints);
    },

    geniusPercent() {
      return this.teamMode ? GENIUS_PERCENTAGE_TEAM : GENIUS_PERCENTAGE_SOLO;
    },

    flagStyles() {
      const halfFlagWidth = '32px';
      const percent = `${this.geniusPercent * 100}%`;
      return {
        left: `calc(${percent} - ${halfFlagWidth})`,
      };
    },

    label() {
      return this.teamMode ? 'Team' : 'Solo';
    },

    percentComplete() {
      return (this.points / this.possiblePoints).toFixed(2);
    },
  },

}
</script>

<style scoped>
.genius-bar {
  position: relative;
}

.flag {
  position: absolute;
  top: -32px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px 3px 0 3px;
  border: var(--border);
  border-radius: var(--radius-sm);
  transition: 0.5s left;
  background: white;
  font-size: 14px;
  width: 64px;
}

.flag::after {
  content: '';
  width: 1px;
  height: 10px;
  background: var(--color-muted);
  position: absolute;
  left: calc(50% - 1px);
  top: 100%;
}

.flag-points {
  position: relative;
}

.icon {
  position: relative;
  top: -1px;
  width: 20px;
  margin-right: 2px;
}

.is-genius .flag {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.rail {
  position: relative;
  overflow: hidden;
  height: 16px;
  border-radius: var(--radius-sm);
  background: var(--color-muted);
}

@media (min-width: 640px) {
  .rail {
    height: 24px;
  }
}

.rail-fill {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--color-primary);
  transform-origin: left;
  transition: 0.5s transform;
}

</style>
