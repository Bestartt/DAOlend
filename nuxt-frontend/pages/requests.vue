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

    <div class="center px:2 md:px-12 py-6">
        <!-- header -->
        <div class="w-full md:w-480px flex justify-between">
            <h4>Your join requests</h4>
            <button @click="clear()" class="btn btn-danger">
                clear
            </button>
        </div>

        <!-- loading -->
        <spinner :pending="pending"></spinner>

        <!-- error -->
        <b v-if="status == 'error'">
            <error-alert></error-alert>     
        </b> 
        
        <div v-auto-animate v-if="status == 'success'" max-w-90vw>
            <div v-for="(union, i) in data" class="card card-body mt-3">
                
                <!-- card header -->
                <div flex justify-between>
                    <h3>{{ union.name }}</h3>
                    <button class="btn-close btn-sm" @click="remove(i)"></button>
                </div>
                
                <!-- data -->
                <p>creator: {{ union.ownerName }}</p>
                <p>address: {{ union.address }}</p>

                <!-- status -->
                <p>status: 
                    <span v-if="union.joined" text-green>
                        <span class="badge rounded-pill text-bg-success">
                            you have joined
                        </span>
                    </span>
                    <span v-else>
                        <span class="badge rounded-pill text-bg-warning">
                            waiting
                        </span>
                    </span>
                </p>

                <!-- link -->
                <router-link 
                    :to="`/unions/${union.address}/`" 
                    class="btn btn-dark" 
                    v-if="union.joined"
                >
                    go to
                </router-link>
            </div>            
        </div>


    </div>

</template>
