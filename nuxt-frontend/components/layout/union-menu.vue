<script lang="ts" setup>
    import { useRoute } from 'nuxt/app';
    let route = useRoute();

    let menu = computed(() => [
            {
                name: "Главное",
                route: `/unions/${route.params.address}/`, 
                class: ''
            },
            {
                name: "Участники",
                route: `/unions/${route.params.address}/members/`,
            },
            {
                name: "Депозиты",
                route: `/unions/${route.params.address}/deposits/`,
            },
            {
                name: "Заявки на кредит",
                route: `/unions/${route.params.address}/credit-requests/`
            },
            {
                name: "Кредиты",
                route: `/unions/${route.params.address}/credits/`,
            },
            {
                name: "Запросы на вступление",
                route: `/unions/${route.params.address}/join/`
            },
            {
                name: "История",
                route: `/unions/${route.params.address}/history/`
            }
    ]);

    const updateMenu = () => {
        for (let i=0; i < menu.value.length; i++) {
            menu.value[i].class = menu.value[i].route == route.path ? 'active' : '' 
        }        
    }

    updateMenu();

    watch(route, updateMenu);

</script>

<template>
    <ul class="nav nav-pills sidenav card card-body mt-17" style="height: fit-content;">

        <li v-for="item in menu" class="nav-item">

            <nuxt-link prefetch
                :to="item.route" 
                :class="('nav-link ' + item.class)"
            >
            {{ item.name }}
            </nuxt-link>
            
        </li>   
    </ul>
</template>

<style>
    .nav-pills .nav-link.active {
        background-color: #474b4f;
    }

    .sidenav .nav-link {
        color: black;
        background-color: white;
        flex-direction: column;
    }
</style>

