<script setup lang="ts">
    let network = ref("");
    let isOpen = ref(false);


    onMounted(async () => {
        let network_name = (await connection.getNetwork()).name;
        if (network_name == "unknown") {
            network.value = "локальная"
        }else if (network_name == "homestead") {
            network.value = "ethereum"
        } else {
            network.value = network_name
        }
    })

</script>



<template>
    <nav class="navbar navbar-expand-md border-bottom px-1 md:px-10 no-shadow">
        <div class="container-fluid">

            <!-- logo -->
            <router-link to="/" class="navbar-brand ms-20 flex">
                <img src="/icon.svg" alt="icon" width="30" height="30"  class="d-inline-block align-text-top">
            </router-link>

            <!-- navbar toggle button (mobile only) -->
            <button 
                class="navbar-toggler" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
            >
                <span class="navbar-toggler-icon"></span>
            </button>


            <div class="collapse navbar-collapse" style="justify-content: space-around;" id="navbarNav">
                <ul class="navbar-nav">

                    <!-- dropdown -->
                    <li class="nav-item">
                        <button class="nav-link" @click="isOpen = true;">организации</button>
                    </li>

                    <li class="nav-item">   
                        <nuxt-link prefetch to="/requests" class="nav-link">мои запросы</nuxt-link>
                    </li>

                    <li class="nav-item">
                        <nuxt-link prefetch to="/unions/search" class="nav-link">найти</nuxt-link>
                    </li>

                    <li class="nav-item">
                        <nuxt-link prefetch to="/unions/create" class="nav-link">создать</nuxt-link>
                    </li>

                    <li class="nav-item">
                        <nuxt-link prefetch to="/created-unions" class="nav-link">созданные</nuxt-link>
                    </li>
                </ul>
            </div>

            <div class="d-none d-md-flex" flex flex-col mr-22>
                <span text-gray text-xs>сеть</span>
                <b text-lg style="margin-top: -10px;">{{ network }}</b>                    
            </div>
        </div>

        <unions-modal :is-open="isOpen" @on-close="isOpen = false"></unions-modal>

    </nav>
</template>


<style scoped>
    .dropdown-menu {
        z-index: 100;
    }
</style>


