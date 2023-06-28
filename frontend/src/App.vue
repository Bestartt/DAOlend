<template>

    <main>
      <Navbar />
      <div px-24 px-md-32 block>
        <router-view>
        </router-view>
      </div>
      
      <TheFooter />
    </main>

</template>


<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
