<script lang="ts" setup>
    let route = useRoute();

    let address = route.params.address;

    let menu = ref([
        {
            name: "Главное",
            route: `/unions/${address}`, 
            class: ''
        },
        {
            name: "Участники",
            route: `/unions/${address}/members`,
        },
        {
            name: "Заявки на кредит",
            route: `/unions/${address}/credit-requests`
        },
        {
            name: "Кредиты",
            route: `/unions/${address}/credits`,
        },
        {
            name: "Запросы на вступление",
            route: `/unions/${address}/join`
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
    <ul class="nav nav-pills flex-column sidenav">

        <li v-for="item in menu" class="nav-item">

            <router-link 
                :to="item.route" 
                :class="('nav-link ' + item.class)"
            >
            {{ item.name }}
            </router-link>
            
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

