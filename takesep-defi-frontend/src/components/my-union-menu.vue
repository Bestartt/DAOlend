<script lang="ts" setup>
    let route = useRoute();

    let menu = [
        {
            name: "Главное",
            route: "/unions/my", 
            class: ''
        },
        {
            name: "Участники",
            route: "/unions/my/members",
        },
        {
            name: "Заявки на кредит",
            route: "/unions/my/credit-requests"
        },
        {
            name: "Кредиты",
            route: "/unions/my/credits",
        },
        {
            name: "Запросы на вступление",
            route: "/unions/my/join"
        }
    ];

    for (let i=0; i < menu.length; i++) {
        menu[i].class = menu[i].route == route.path ? 'active' : '' 
    }


</script>

<template>
    <ul class="nav nav-tabs">

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
