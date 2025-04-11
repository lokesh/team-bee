<template>
  <div class="app">
    <debugger v-if="showDebugger" />
    <router-view v-if="isLoaded">
    </router-view>
    <page-spinner v-else />
  </div>
</template>

<script>
import PageSpinner from '@/components/PageSpinner';
import Debugger from '@/components/Debugger';
import { mapState } from 'vuex';

export default {
  name: 'App',

  components: {
    PageSpinner,
    Debugger,
  },

  computed: {
    ...mapState([
      'showDebugger',
    ]),
  },

  data() {
    return {
      isLoaded: false,
    };
  },

  async beforeCreate() {
    await this.$store.dispatch('loadUsers');
    await this.$store.dispatch('loadPuzzles');

    // Check if user is already set, then skip login screen
    const userId = JSON.parse(localStorage.getItem('userId'));

    if (userId) {
      this.$store.commit('setUserId', userId);
      if (this.$route.name !== 'Game') {
        this.$router.push({ name: 'Game' });
      }
    }

    this.isLoaded = true;
  },
}
</script>

<style>
@import "./styles/base.css";
</style>

<style scoped>
.app {
  max-width: 1024px;
  margin: 0 auto;
}
</style>
