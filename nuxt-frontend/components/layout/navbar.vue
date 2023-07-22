<script setup lang="ts">
    let myUnionExists = ref(false);

    let requests = join_requests.get();
    let unions = ref<any[]>([]);
    let network = ref("");

    async function getOrganizationData() {
        let joinRequests = await getJoinRequests(requests);
        unions.value = joinRequests.filter(request => request.joined);
        myUnionExists.value = await connection.contractExists(my_union.get());        
    }

    function update(event: MouseEvent) {
        event.stopPropagation();

        getOrganizationData();
    }

    onMounted(async () => {
        getOrganizationData();
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
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">организации</a>

                        <ul class="dropdown-menu" v-auto-animate>

                            <!-- my union -->
                            <template v-if="myUnionExists">
                                <nuxt-link prefetch :to="`/unions/${my_union.get()}/`" class="dropdown-item">
                                    моя организация
                                </nuxt-link >
                                <li><hr class="dropdown-divider"></li>
                            </template>

                            <!-- unions list -->
                            <template v-for="union in unions">
                                <nuxt-link 
                                    :to="`/unions/${union.address}/`" 
                                    class="dropdown-item"
                                >
                                    {{ union.name }}
                                </nuxt-link>
                            </template>
                            
                            <!-- end dropdown -->
                            <li v-if="unions.length > 0"><hr class="dropdown-divider"></li>
                            <button class="dropdown-item btn btn-warning" @click.stop="update">обновить</button>

                        </ul>
                    </li>

                    <li class="nav-item">   
                        <nuxt-link prefetch to="/requests" class="nav-link">мои запросы</nuxt-link>
                    </li>

                    <li class="nav-item">
                        <nuxt-link prefetch to="/unions/search" class="nav-link">найти</nuxt-link>
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
    </nav>
</template>


<style scoped>
    .dropdown-menu {
        z-index: 100;
    }
</style>
