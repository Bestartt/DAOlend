<script lang="ts" setup>
    import { Contract } from "~/utils/contract";


    let route = useRoute();
    let address = route.params.address;
    
    let { data, pending, status } = await useAsyncData('organization_data', async () => {
        // @ts-ignore
        let contract: Contract = new Contract(address);
        return contract.getData()    
    });
</script>


<template>
    <main>
      <Navbar />
      <notification></notification>
      <div px-24 px-md-32 block>
        <div>
            <br>

            <breadcumps v-if="status == 'success'"  :address="address" :union_name="data.name" />

            <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>            
            </div>

            <hr>    

            <div flex gap-12>
                <union-menu></union-menu>

                <div block style="width: 100%;">
                    <slot />
                </div>

            </div>
        </div>
      </div>
      
      <footer />
    </main>


</template>
