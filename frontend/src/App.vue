<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from './stores/user'
import { usePuzzleStore } from './stores/puzzle'
import PageSpinner from '@/components/PageSpinner.vue'
import Debugger from '@/components/Debugger.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const puzzleStore = usePuzzleStore()

const isLoaded = ref(false)
const showDebugger = ref(false) // You might want to move this to a separate store

onBeforeMount(async () => {
  await userStore.loadUsers()
  await puzzleStore.loadPuzzles()

  // Check if user is already set, then skip login screen
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId) {
    userStore.setUserId(userId)
    if (route.name !== 'Game') {
      router.push({ name: 'Game' })
    }
  }

  isLoaded.value = true
})
</script>

<template>
  <div class="app">
    <debugger v-if="showDebugger" />
    <router-view v-if="isLoaded">
    </router-view>
    <page-spinner v-else />
  </div>
</template>

<style>
@import "./styles/base.css";
</style>

<style scoped>
.app {
  max-width: 1024px;
  margin: 0 auto;
}
</style>
