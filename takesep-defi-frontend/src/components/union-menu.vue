<script lang="ts" setup>
    let route = useRoute();

    let address = route.params.address;

    let menu = [
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
    ];

    for (let i=0; i < menu.length; i++) {
        menu[i].class = menu[i].route == route.path ? 'active' : '' 
    }


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
