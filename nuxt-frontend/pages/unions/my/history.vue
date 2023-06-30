<script setup lang="ts">
    import { getHistory, AsyncReturnType } from "~/utils/history";
    definePageMeta({layout: "my-union"})

    let address = get_my_union();
    let history = ref<AsyncReturnType<typeof getHistory>>([]);
    
    
    onMounted(async () => {
        if (address !== null) {
            history.value = await getHistory(address);
        }
    })

</script>


<template>

    <div>
        <h3 mt-5>История</h3>

        Пока еще не придумал как реализовать          
    </div>
    

    
</template>

