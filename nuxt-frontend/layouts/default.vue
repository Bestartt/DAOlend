<template>

    <main>
      <Navbar />
      <notification></notification>
      <div class="px-3 md:px-24 bg-gray-1 content">
        <slot/>
      </div>
      
      <footer />
    </main>

</template>



<style scoped>
  .content {
    display: block;
    min-height: 90vh;
  }
</style>
