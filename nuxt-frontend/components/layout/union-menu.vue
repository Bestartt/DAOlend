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

    let mobileSidenavBottom = ref("-315px");

    function triggerSidenav() {
        if (mobileSidenavBottom.value !== "0") {
            mobileSidenavBottom.value = "0";
        } else {
            mobileSidenavBottom.value = "-315px";
        }
    }

</script>

<template>
    <ul class="nav nav-pills sidenav card card-body mt-17 hidden md:block">

        <li v-for="item in menu" class="nav-item">

            <nuxt-link prefetch
                :to="item.route" 
                :class="('nav-link ' + item.class)"
            >
            {{ item.name }}
            </nuxt-link>
            
        </li>   
    </ul>

    <div block md:hidden class="mobile-sidenav card card-body" :style="{bottom: mobileSidenavBottom}">
        <button class="btn btn-dark mb-2 mt-0" @click="triggerSidenav()">menu</button>
        <ul class="nav nav-pills block">

            <li v-for="item in menu" class="nav-item">

                <nuxt-link prefetch
                    :to="item.route" 
                    :class="('nav-link ' + item.class)"
                >
                {{ item.name }}
                </nuxt-link>
                
            </li>   
        </ul>
    </div>
</template>


<style>
    .nav-pills .nav-link.active {
        background-color: #474b4f;
    }

    .sidenav .nav-link, .nav-pills .nav-link {
        color: black;
        background-color: white;
        flex-direction: column;
    }

    .sidenav {
        height: fit-content;
        min-width: 220px;
    }

    .mobile-sidenav {
        position: fixed;
        left: 0;
        z-index: 10;
        width: 100vw;
    }

    .mobile-sidenav .btn {
        box-shadow: none;
    }
</style>

