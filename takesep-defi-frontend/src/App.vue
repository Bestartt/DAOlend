<script setup>
  import { ref } from 'vue';

  let drawer = ref(false);

</script>



<template>

    <main>
      <Navbar />
      <div px-24 px-md-32 block>
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      
      <TheFooter />
    </main>

</template>


<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
