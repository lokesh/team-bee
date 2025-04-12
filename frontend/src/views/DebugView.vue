<template>
  <div class="page">
    <div class="debug-info">
      <div class="debug-item">
        <span class="label">User ID:</span>
        <span class="value">{{ store.userId }}</span>
      </div>
      <div class="debug-item">
        <span class="label">Is Ready:</span>
        <span class="value">{{ store.isReady }}</span>
      </div>
      <div class="debug-item">
        <span class="label">Store Ready:</span>
        <span class="value">{{ store.storeReady }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '@/stores'

const store = useStore()
</script>

<style scoped>
.page {
  /* padding: var(--gutter); */
  text-align: center;
  font-family: monospace;
  font-size: 12px;
}

.debug-info {
  /* margin-top: 2rem; */
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* align-items: center; */
}

.debug-item {
  display: flex;
  gap: 4px;
  align-items: center;
}

.label {
  font-weight: bold;
  min-width: 100px;
  text-align: right;
}

.value {
  padding: 2px 4px;
  background: #f0f0f0;
  border-radius: 4px;
}
</style> 