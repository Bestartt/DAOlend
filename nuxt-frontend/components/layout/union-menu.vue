<script lang="ts" setup>
    import { useRoute } from 'nuxt/app';
    let route = useRoute();

    let address = ref("");

    watch(route, () => {
        // @ts-ignore
        address.value = route.params.address;
    })

    let menu = ref([]);

    watch(address, () => {
        menu.value = [
            {
                name: "Главное",
                route: `/unions/${address.value}/`, 
                class: ''
            },
            {
                name: "Участники",
                route: `/unions/${address.value}/members/`,
            },
            {
                name: "Депозиты",
                route: `/unions/${address.value}/deposits/`,
            },
            {
                name: "Заявки на кредит",
                route: `/unions/${address.value}/credit-requests/`
            },
            {
                name: "Кредиты",
                route: `/unions/${address.value}/credits/`,
            },
            {
                name: "Запросы на вступление",
                route: `/unions/${address.value}/join/`
            },
            {
                name: "История",
                route: `/unions/${address.value}/history/`
            }
        ];
    })

    const updateMenu = () => {
        for (let i=0; i < menu.value.length; i++) {
            menu.value[i].class = menu.value[i].route == route.path ? 'active' : '' 
        }        
    }

    updateMenu();

    watch(route, updateMenu);

</script>

<template>
    <ul class="nav nav-pills flex-column sidenav bg-white card card-body">

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
    }
</style>

