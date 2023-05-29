<script lang="ts" setup>
    import { Contract } from "~/crypto";

    let route = useRoute();
    let address = route.params.address;
    let contract: Contract;
    let members = ref();
    
    
    if (address != null) {
        // @ts-ignore
        contract = new Contract(address);
        contract.getMembers().then(d => members.value = d);
    }


</script>

<template>
    <h3 mt-5>Участники</h3>

    <union-menu></union-menu>

    <br>

    <ul>
        <li v-for="member in members">{{ member }}</li>
    </ul>
</template>
