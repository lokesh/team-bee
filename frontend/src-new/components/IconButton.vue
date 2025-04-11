<template>
    <div
      class="button"
      :class="`radius-${radius}`"
      @click="$emit('click', $event)"
    >
      <template v-if="icon === 'user'">
        <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18 4C15.7909 4 14 5.79086 14 8C14 10.2091 15.7909 12 18 12C20.2091 12 22 10.2091 22 8C22 5.79086 20.2091 4 18 4ZM10 8C10 3.58172 13.5817 0 18 0C22.4183 0 26 3.58172 26 8C26 12.4183 22.4183 16 18 16C13.5817 16 10 12.4183 10 8Z" fill="black"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.15251 30.0148C5.03287 31.9385 6.83401 33.3892 9.26923 34.4038C11.9644 35.5268 15.1887 36 18 36C20.8113 36 24.0356 35.5268 26.7308 34.4038C29.166 33.3892 30.9671 31.9385 31.8475 30.0148C30.9392 28.1802 28.8246 26.6907 26.032 25.6167C23.016 24.4567 19.7598 24 18 24C16.2402 24 12.984 24.4567 9.96796 25.6167C7.17543 26.6907 5.06076 28.1803 4.15251 30.0148ZM8.53204 21.8833C12.016 20.5433 15.7598 20 18 20C20.2402 20 23.984 20.5433 27.468 21.8833C30.8684 23.1912 34.6039 25.4872 35.8974 29.3675C36.0342 29.7781 36.0342 30.2219 35.8974 30.6325C34.647 34.3836 31.568 36.7217 28.2692 38.0962C24.9644 39.4732 21.1887 40 18 40C14.8113 40 11.0356 39.4732 7.73077 38.0962C4.43198 36.7217 1.35302 34.3836 0.102633 30.6325C-0.0342111 30.2219 -0.0342111 29.7781 0.102633 29.3675C1.39609 25.4872 5.13163 23.1912 8.53204 21.8833Z" fill="black"/>
        </svg>
      </template>
      <template v-else-if="icon === 'x'">
       <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.732234 0.732233C-0.244078 1.70854 -0.244078 3.29146 0.732234 4.26777L25.7322 29.2678C26.7085 30.2441 28.2915 30.2441 29.2678 29.2678C30.2441 28.2915 30.2441 26.7085 29.2678 25.7322L4.26777 0.732233C3.29146 -0.244078 1.70854 -0.244078 0.732234 0.732233Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.2678 0.732233C30.2441 1.70854 30.2441 3.29146 29.2678 4.26777L4.26777 29.2678C3.29146 30.2441 1.70854 30.2441 0.732234 29.2678C-0.244077 28.2915 -0.244077 26.7085 0.732234 25.7322L25.7322 0.732233C26.7085 -0.244078 28.2915 -0.244078 29.2678 0.732233Z" fill="black"/>
</svg>

      </template>
    </div>
</template>

<script>
export default {
    name: 'IconButton',

    props: {
      icon: {
        type: String,
        required: true,
      },
      radius: {
        type: String,
        default: 'medium',
      },
    },
}
</script>

<style scoped>
.button{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border: var(--border);
}

svg {
  width: 16px;
}

.button.radius-medium {
  border-radius: var(--radius);
}

.button.radius-small {
  border-radius: var(--radius-sm);
}
</style>
