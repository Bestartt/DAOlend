<script setup lang="ts">
    let myUnionExists = ref(false);

    let requests = get_join_requests();
    let unions = ref<any[]>([]);

    async function getOrganizationData() {
        let requested_unions = await getRequestsData(requests);
        unions.value = requested_unions.filter(request => request.joined);
        myUnionExists.value = await contractExists(get_my_union());        
    }

    function update(event: MouseEvent) {
        event.stopPropagation();

        getOrganizationData();
    }

    onMounted(() => {
        getOrganizationData()
    })

</script>



<template>
    <nav class="navbar navbar-expand-md bg-body-tertiary" bg-gray-1>
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">Главная</router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">организации</a>

                        <ul class="dropdown-menu">
                            <template v-if="myUnionExists">
                                <router-link to="/unions/my" class="dropdown-item">моя организация</router-link>
                                <li><hr class="dropdown-divider"></li>
                            </template>

                            <template v-for="union in unions">
                                <router-link :to="`/unions/${union.address}/`" class="dropdown-item">{{ union.name }}</router-link>
                            </template>
                            
                            <li><hr class="dropdown-divider"></li>

                            <button class="dropdown-item btn btn-dark" @click.stop="update">обновить</button>

                        </ul>
                    </li>

                    <li class="nav-item">
                        <router-link to="/requests" class="nav-link">мои запросы</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link to="/unions/search" class="nav-link">найти</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>


<style>

</style>
