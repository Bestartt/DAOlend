<script lang="ts" setup>
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";

    let address = get_my_union();
    let contract: Contract;
    let data = ref<any>(null);
    
    
    if (address != null) {
        contract = new Contract(address);
        contract.getData().then(d => data.value = d);
    }


</script>


<template>
    <div v-if="address == null">
        <h3>
            У вас нет организации. 
        </h3>

        <router-link to="/create-union">создать</router-link>
    </div>

    <div v-if="data != null">
        <br>
        <span mt-5>Организация: </span>
        <h3>{{ data.name }}</h3>
        <p text-gray>Адрес: {{ get_my_union() }}</p>

        <hr>    

        <div flex gap-12>
            <my-union-menu></my-union-menu>

            <div><slot /></div>

        </div>
    </div>

</template>
