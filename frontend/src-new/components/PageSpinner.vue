<template>
    <div class="page-spinner">
        <spinner></spinner>
    </div>
</template>

<script>
import Spinner from '@/components/Spinner';

export default {
    name: 'PageSpinner',

    components: {
        Spinner,
    },
}
</script>

<style scoped>
.page-spinner {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
