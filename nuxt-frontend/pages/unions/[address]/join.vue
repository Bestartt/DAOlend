<script lang="ts" setup>
    definePageMeta({layout: "union"})

    let route = useRoute();
    // @ts-ignore
    let address: string = route.params.address;
    let contract = new Contract(address);
    
    let loading = ref(false);
    let notif = useNotification();
    
    let { data, pending, refresh, status } = useAsyncData(async () => {
        let requests = await contract.getJoinRequests()
        return requests.filter(r => r[2] !== "0x0000000000000000000000000000000000000000");
    });


    async function approve(requestAddress: string) {
        loading.value = true;
        // @ts-ignore
        try {
            let contract = new Contract(address);
            await contract.approveJoin(requestAddress);
            notif.notify("The transaction will be completed soon", "Soon you will be in the list of approved members")          
        } catch (e) {
            alert("Canceled or error. Make sure that you have logged to Metamask");
        } finally {
            loading.value = false;
        }
    }
</script>

<template>
    <div>
        <div flex justify-between>
            <h4>Join requests</h4>
            <button class="btn btn-dark" @click="refresh()">refresh</button>
        </div>
        <br>

        <b v-if="status == 'error'">
            <error-alert></error-alert>     
        </b> 

        <!-- loading -->
        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <div v-if="data && data.length == 0 && !pending">
            <h2 text-gray>Empty</h2>
        </div>

        <div v-if="!pending" v-auto-animate>
            <template v-for="request in data">
                <div max-w-700px class="card">
                    <div class="card-header md:flex justify-between items-center">
                        <div>
                            <span tex-gray text-sm>Имя: </span>
                            <h5>{{ request.name }}</h5>
                        </div>

                        <i text-gray>адрес: {{ request.member }}</i>

                    </div>
                    
                    <div class="card-body">
                        <b v-if="request.approvedMembers.length == 0" class="text-gray">Nobody approved yet</b>
                        
                        <div v-else>
                            <b>Approved members</b>

                            <members-list 
                                :approved-members="request.approvedMembers" 
                                :contract-address="address"
                            >
                            </members-list>
                        </div>
                        <br>    
                        <button max-w-200px class="btn btn-dark mt-3" @click="approve(request.member)">
                            <button-loading :loading="loading">approve</button-loading>
                        </button>
                    </div>
                </div>
            </template>             
        </div>
        
    </div>

</template>
