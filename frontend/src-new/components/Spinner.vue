<template>
  <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
    <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
  </svg>
</template>

<script>
export default {
  name: 'Spinner',
}
</script>

<style scoped>
.spinner {
  --offset: 187;
  --duration: 2s;
  animation: rotator var(--duration) linear infinite;
}

@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
}

.path {
  stroke-dasharray: var(--offset);
  stroke-dashoffset: 0;
  transform-origin: center;
  animation:
    dash var(--duration) ease-in-out infinite,
    colors calc(var(--duration) * 2) ease-in-out infinite;
}

@keyframes colors {
  0% { stroke: var(--color-primary); }
  10% { stroke: var(--color-primary); }
  50% { stroke: var(--color-secondary); }
  90% { stroke: var(--color-primary); }
  100% { stroke: var(--color-primary); }
}

@keyframes dash {
  0% { stroke-dashoffset: var(--offset); }
  50% {
    stroke-dashoffset: var(--offset)/4;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: var(--offset);
    transform: rotate(450deg);
  }
}
</style>

