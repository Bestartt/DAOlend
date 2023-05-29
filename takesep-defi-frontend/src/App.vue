<script setup>
  import { ref } from 'vue';

  let drawer = ref(false);

</script>



<template>

    <main>
      <Navbar />
      <div px-16 px-md-32 block>
        <RouterView />
      </div>
      
      <TheFooter />
    </main>

</template>

