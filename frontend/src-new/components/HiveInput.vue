<template>
  <div class="wrapper">
    <div
      ref="notice"
      class="notice"
      @animationend="onNoticeEnd"
      v-html="noticeMsg"
    >
    </div>
    <div
      ref="input"
      class="input"
      @animationend="onShakeEnd"
    >

      <span
        v-for="(letter, i) in input.split('')"
        :key="i"
        class="letter"
        :class="{
          'letter': true,
          'letter--center': letter === centerLetter,
          'letter--invalid': !letters.includes(letter),
        }"
       >
        {{ letter }}
      </span>
      <span class="caret" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import EventBus from '@/event-bus.js';
import { calcPoints, isPangram } from '@/utils';

export default {
  name: 'HiveInput',

  data() {
    return {
      isNoticeVisible: false,
      noticeMsg: '',
    };
  },

  computed: {
    ...mapState([
      'input',
    ]),
    ...mapGetters([
      'user',
      'puzzle',
      'teamMode',
      'foundWords',
    ]),

    centerLetter() {
      return this.puzzle.center_letter;
    },
    outerLetters() {
      return this.puzzle.outer_letters;
    },
    letters() {
      return [this.centerLetter, ...this.outerLetters];
    },
  },

  mounted() {
    document.addEventListener('keydown', this.onKey);
    EventBus.$on('submitInput', this.submit);
  },

  destroyed() {
    document.removeEventListener('keydown', this.onKey);
    EventBus.$off('submitInput', this.submit);
  },

  methods: {
    onKey(e) {
      if (e.keyCode !== 13) return;

      // Enter pressed
      this.submit();
    },

    notice(str) {
      this.noticeMsg = str;
      this.$refs.notice.classList.add('notice--visible');
    },

    onNoticeEnd() {
      this.$refs.notice.classList.remove('notice--visible');
    },

    onShakeEnd() {
      this.$refs.input.classList.remove('input--error');
      this.$store.commit('clearInput');
    },

    shake() {
      this.$refs.input.classList.add('input--error');
    },

    submit() {
      // Used a wrong letter
      if (!this.input
          .split('')
          .every(letter => this.letters.includes(letter))
        ) {
        this.notice('Wrong letters');
        this.shake();

      } else if (this.input.length < 4) {
        // Too short
        this.notice('Too short');
        this.shake();

      } else if (!this.input.includes(this.centerLetter)) {
        // Missing center letter
        this.notice('Missing center letter');
        this.shake();

      } else if (this.foundWords.includes(this.input)) {
        // Already found
        this.notice('Already found');
        this.shake();

      } else if (!this.puzzle.answers.includes(this.input)) {
        // Not in word list
        this.notice('Not in word list');
        this.shake();

      } else {
        // Good!
        let points = calcPoints([this.input]);
        let str = isPangram(this.input) ? 'Pangram! ' : '';
        this.notice(`${str} +${points}`);

        this.$store.dispatch('addFoundWord', this.input);
        this.$store.commit('clearInput');
      }
    } ,
  },
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notice {
  position: absolute;
  display: inline-block;
  opacity: 0;
  padding: 8px 12px;
  color: white;
  background: var(--color-bg-dark);
  border-radius: var(--radius);
  pointer-events: none;
  text-align: center;
  user-select: none;
}

.notice--visible {
  animation: fade-in-out 1.5s;
}

.input {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  font-size: 36px;
  font-weight: var(--weight-bold);
  line-height: 1;
  letter-spacing: 0.025em;
  text-align: center;
  text-transform: uppercase;
  user-select: none;
}

.input--error {
  animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both
}

.letter--center {
  color: var(--color-primary);
}

.letter--invalid {
  color: var(--color-muted);
}

.caret {
  width: 4px;
  height: 1em;
  background: var(--color-primary);
  animation: blink 1.0s cubic-bezier(.215,.61,.355,1) forwards infinite;
}

@keyframes shake {
    10%, 90% {
        transform: translate3d(-1px, 0, 0)
    }
    20%, 80% {
        transform: translate3d(2px, 0, 0)
    }
    30%, 50%, 70% {
        transform: translate3d(-4px, 0, 0)
    }
    40%, 60% {
        transform: translate3d(4px, 0, 0)
    }
}

@keyframes fade-in-out {
    0% {
        opacity: 0;
    }
    20%,
    80% {
        opacity: 1;
    }
    100% {
      opacity: 0;
    }
}

@keyframes blink {
    from,to {
        opacity: 1
    }
    50% {
        opacity: 0
    }
}

</style>
