<script lang="ts" setup>

    let unions = ref(created_unions.get());


</script>


<template>
    <div py-3>
        <h3>Созданные организации</h3>

        <div class="card card-body"  v-for="union in unions" mt-3 max-w-500px>
            
            <span>
                <b>{{ union.name }} </b> <br>
                <span>админ: {{ union.owner_name }}</span>
            </span>


            <span>{{ union.network.name }} - {{ union.network.chain_id }}</span>

            <span text-gray>{{ new Date(union.date).toLocaleString("ru") }}</span>

            <span class="text-gray text-sm">
                {{ address }}  
            </span>
        </div>
    </div>


</template>