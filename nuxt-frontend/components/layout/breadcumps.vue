<script lang="ts" setup>
    let route = useRoute();
    
    let props = defineProps<{
        address: string | 'my',
        union_name: string
    }>();

    let routes = [
        {
            name: "Organization",
            route: `/unions/${props.address}`, 
        },
        {
            name: "Members",
            route: `/unions/${props.address}/members`,
        },
        {
            name: "Loan applications",
            route: `/unions/${props.address}/credit-requests`
        },
        {
            name: "Credits",
            route: `/unions/${props.address}/credits`,
        },
        {
            name: "Join applications",
            route: `/unions/${props.address}/join`
        },
        {
            name: "History",
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
