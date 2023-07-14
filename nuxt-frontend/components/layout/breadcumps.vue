<script lang="ts" setup>
    let route = useRoute();
    
    let props = defineProps<{
        address: string | 'my',
        union_name: string
    }>();

    let routes = [
        {
            name: "Главное",
            route: `/unions/${props.address}`, 
        },
        {
            name: "Участники",
            route: `/unions/${props.address}/members`,
        },
        {
            name: "Заявки на кредит",
            route: `/unions/${props.address}/credit-requests`
        },
        {
            name: "Кредиты",
            route: `/unions/${props.address}/credits`,
        },
        {
            name: "Запросы на вступление",
            route: `/unions/${props.address}/join`
        },
        {
            name: "История",
            route: `/unions/${props.address}/history`
        }
    ]

    let routes_dict = {}

    routes.forEach(item => {   
        routes_dict[item.route] = item.name;
    })


</script>


<template>
    <nuxt-link prefetch to="/unions/my">
        <b>{{ union_name }}</b>
    </nuxt-link>
     / {{ routes_dict[route.path] }}
</template>
