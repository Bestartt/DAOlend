<script lang="ts" setup>
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";

    let address = get_my_union();
    let contract: Contract;
    let members = ref();
    
    
    if (address != null) {
        contract = new Contract(address);
        contract.getMembers().then(d => members.value = d);
    }


</script>

<template>

    <div v-if="address == null">
        <h3>
            У вас нет организации. 
        </h3>

        <router-link to="/create-union">создать</router-link>
    </div>

    <div v-else>

        <h3 mt-5>Участники</h3>

        <my-union-menu></my-union-menu>

        <br>

        <ul>
            <li v-for="member in members">{{ member }}</li>
        </ul>

    </div>
</template>
