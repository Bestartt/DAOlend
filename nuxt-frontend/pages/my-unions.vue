<script lang="ts" setup>

    let unions = ref(created_unions.get());




</script>


<template>
    <div py-3>
        <h3>Созданные организации</h3>

        <div class="card card-body"  v-for="union in unions" mt-3 max-w-700px>
            <div class="row items-center">
                <b text-lg class="col-4">{{ union.name }} </b>

                <div class="flex flex-col col-4">
                    <span text-gray text-sm mb--5px>сеть</span>
                    <span>{{ union.network.name }}</span>                      
                </div>

                <span text-gray class="col-4">{{ new Date(union.date).toLocaleString("ru") }}</span>  
            </div>

            <hr>
            
            <div class="flex justify-between">
                <div>    
                    <span>админ: {{ union.owner_name }}</span> <br>
                    <span class="text-gray text-sm">{{ union.address }} </span>                    
                </div>

                <button class="btn btn-dark max-h-40px">переключиться</button>
            </div>


        </div>
    </div>


</template>