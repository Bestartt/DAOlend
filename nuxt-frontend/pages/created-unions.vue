<script lang="ts" setup>
    import autoAnimate from '@formkit/auto-animate';

    let unions = ref(created_unions.get().reverse());
    let current_union_address = ref(my_union.get());
    let network = ref("");
    let list = ref();

    function is_local(str: string) { 
        return str == "unknown" ? "локальный" : str
    }

    onMounted(async () => {
        network.value = (await connection.getNetwork()).name;
        autoAnimate(list.value);
    });


    function switch_union(new_address: string) {
        my_union.set(new_address);
        current_union_address.value = new_address;
    }

    function remove(id: number) {
        unions.value.splice(id, 1);
        created_unions.remove(unions.value.length - id - 1);
    }

</script>


<template>
    <div py-3>
        <h3 my-5 text-center>Созданные организации</h3>


        <div ref="list">

            <div class="card card-body mt-3 max-w-700px" 
                style="margin: 10px auto;" 
                v-for="(union, i) in unions" 
                :key="i"
            >
            
                <button class="btn btn-close right-0" @click="remove(i)"></button>
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
    </div>


</template>
