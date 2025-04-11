<template>
  <div
    class="tag"
    :style="`background: ${user.color}`"
  >
    {{ user.name.slice(0, 1) }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserTag',

  props: {
    userId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    ...mapState([
      'users'
    ]),

    user() {
      return this.users[this.userId];
    },
  },
}
</script>

<style scoped>
.tag {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  background-color: var(--color-muted);
}
</style>
