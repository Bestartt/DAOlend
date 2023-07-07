<script lang="ts" setup>

    let unions = ref(created_unions.get().reverse());
    let current_union_address = ref(my_union.get());
    let network = ref("");

    function is_local(str: string) { 
        return str == "unknown" ? "локальный" : str
    }

    onMounted(async () => {
        network.value = (await connection.getNetwork()).name;
    });


    function switch_union(new_address: string) {
        my_union.set(new_address);
        current_union_address.value = new_address;
    }

</script>


<template>
    <div py-3>
        <h3 my-5 text-center>Созданные организации</h3>


        <div class="card card-body" style="margin: 10px auto;" v-for="union in unions" mt-3 max-w-700px>
            <div class="row items-center">
                <b text-lg class="col-4">{{ union.name }} </b>

                <div class="flex flex-col col-6">
                    <span text-gray text-sm mb--5px>сеть</span>
                    <span>{{ is_local(union.network.name) }}

                        <span class="badge text-bg-success" v-if="union.network.name == network">текущий</span>
                    </span> 

                </div>

                <span text-gray class="col-2">{{ new Date(union.date).toLocaleString("ru") }}</span>  
            </div>

            <hr>
            
            <div class="flex justify-between">
                <div>    
                    <span>админ: {{ union.owner_name }}</span> <br>
                    <span class="text-gray text-sm">{{ union.address }} </span>                    
                </div>

                <button class="btn btn-outline-dark max-h-40px" disabled v-if="union.address == current_union_address">подключено</button>
                <button class="btn btn-dark max-h-40px" v-else @click="switch_union(union.address)">переключиться</button>
            </div>


        </div>
    </div>


</template>