<template>
  <div class="page">
    <h2>Who's playing?</h2>

    <div class="button-row">
      <button
        v-for="user in users"
        :key="user.id"
        class="button-row-button"
        @click="login(user.id)"
      >
        {{ user.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores'

const router = useRouter()
const store = useStore()

const users = computed(() => store.users)

const login = (id) => {
  store.setUserId(id)
  router.push({ name: 'Game' })
}
</script>

<style scoped>
.page {
  padding: var(--gutter);
  text-align: center;
}

.button-row-button {
  margin-bottom: var(--gutter);
  min-width: 50vw;
}

.button-row {
  flex-direction: column;
  align-items: center;
}

@media (min-width: 640px) {
  .button-row {
    flex-direction: row;
  }

  .button-row-button {
    min-width: auto;
  }
}
</style> 