<script lang="ts" setup>
    import { useRoute } from 'nuxt/app';
    let route = useRoute();

    let menu = computed(() => [
            {
                name: "Organization",
                route: `/unions/${route.params.address}/`, 
                class: ''
            },
            {
                name: "Members",
                route: `/unions/${route.params.address}/members/`,
            },
            {
                name: "Deposits",
                route: `/unions/${route.params.address}/deposits/`,
            },
            {
                name: "Loan applications",
                route: `/unions/${route.params.address}/credit-requests/`
            },
            {
                name: "Credits",
                route: `/unions/${route.params.address}/credits/`,
            },
            {
                name: "Join requests",
                route: `/unions/${route.params.address}/join/`
            },
            {
                name: "History",
                route: `/unions/${route.params.address}/history/`
            }
    ]);

    const updateMenu = () => {
        for (let i=0; i < menu.value.length; i++) {
            menu.value[i].class = menu.value[i].route == route.path ? 'active' : '' 
        }        
    }

    watchEffect(updateMenu);

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

