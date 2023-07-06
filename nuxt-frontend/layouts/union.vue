<script lang="ts" setup>
    import { Contract } from "~/utils/contract";


    let route = useRoute();
    let address = route.params.address;

    let data = ref<any>(null);


    if (address != null) {
        // @ts-ignore
        let contract = new Contract(address);
        contract.getData().then(d => data.value = d);
    }

</script>


<template>
    <main>
      <Navbar />
      <notification></notification>
      <div px-24 px-md-32 block>
        <div v-if="data != null">
            <br>
            <span mt-5>Организация: </span>
            <h3>{{ data.name }}</h3>
            <p text-gray>Адрес: {{ address }}</p>

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
