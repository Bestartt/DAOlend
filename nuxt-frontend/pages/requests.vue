<script setup lang="ts">    
    let { data, pending, status } = useAsyncData(
        "my requests", 
        async() => await getJoinRequests(join_requests.get())
    );

    function remove(index: number) {
        data.value.splice(index, 1);
        join_requests.remove(index);
    }

    function clear() {
        join_requests.clear();
        data.value = [];
    }

</script>

<template>

    <div class="center px-12 py-6">
        <!-- header -->
        <div class="min-w-430px flex justify-between">
            <h4>Ваши запросы</h4>
            <button @click="clear()" class="btn btn-danger">
                очистить
            </button>
        </div>

        <!-- loading -->
        <spinner :pending="pending"></spinner>

        <!-- error -->
        <b v-if="status == 'error'">
            <error-alert></error-alert>     
        </b> 
        
        <div v-auto-animate v-if="status == 'success'">
            <div v-for="(union, i) in data" class="card card-body mt-3 max-w-700px">
                
                <!-- card header -->
                <div flex justify-between>
                    <h3>{{ union.name }}</h3>
                    <button class="btn-close btn-sm" @click="remove(i)"></button>
                </div>
                
                <!-- data -->
                <p>основатель: {{ union.ownerName }}</p>
                <p>адрес: {{ union.address }}</p>

                <!-- status -->
                <p>статус: 
                    <span v-if="union.joined" text-green>
                        <span class="badge rounded-pill text-bg-success">
                            вы вступили
                        </span>
                    </span>
                    <span v-else>
                        <span class="badge rounded-pill text-bg-warning">
                            ожидание
                        </span>
                    </span>
                </p>

                <!-- link -->
                <router-link 
                    :to="`/unions/${union.address}/`" 
                    class="btn btn-dark" 
                    v-if="union.joined"
                >
                    перейти
                </router-link>
            </div>            
        </div>


    </div>

</template>
