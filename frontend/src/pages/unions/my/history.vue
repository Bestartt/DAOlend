<script setup lang="ts">
    import { get_my_union } from "~/localstorage";
    import { getHistory, AsyncReturnType } from "~/history";


    let address = get_my_union();
    let history = ref<AsyncReturnType<typeof getHistory>>([]);
    
    
    onMounted(async () => {
        if (address !== null) {
            history.value = await getHistory(address);
        }
    })

</script>


<template>

    <my-sidebar-wrapper>
        <h3 mt-5>История</h3>


        {{ history }}        
    </my-sidebar-wrapper> 

    
</template>

