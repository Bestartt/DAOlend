<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from "nuxt/app";

    let address = my_union.get();
    let contract: Contract = new Contract(address);
    
    let { data, pending } = await useAsyncData('organization_data', async() => await contract.getData());
    
</script>


<template>
    <main>
      <Navbar />
      <notification></notification>
      <div px-24 px-md-32 block bg-gray-1 style="min-height: 90vh;">
        

        <div>
            <br>

            <template v-if="data != null">
                <breadcumps :union_name="data.name" address="my"/>
            </template>

            <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>            
            </div>


            <hr>    

            <div flex gap-12>
                <my-union-menu></my-union-menu>

                <div block style="width: 100%;">
                    <slot />
                </div>

            </div>
        </div>
      </div>
      
      <footer />
    </main>


</template>
