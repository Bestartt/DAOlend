<script setup lang="ts">
    import { get_my_union } from "~/localstorage";
    // import { Contract } from "~/crypto";


    let address = get_my_union();
    // let contract: Contract;
    let data = ref<any>(null);
    
    
    if (address != null) {
        // contract = new Contract(address);
        // contract.getHistory().then(d => data.value = d);
    }

</script>


<template>

    <sidebar-wrapper>
        <h3 mt-5>История</h3>

        <div v-if="data.length == 0">
            <h2 text-gray>Пусто</h2>

        </div>

        {{ data }}        
    </sidebar-wrapper> 

    
</template>

