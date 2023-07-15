<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    import { useAsyncData } from "nuxt/app";

    let props = defineProps<{
        contractAddress: string, 
        memberAddresses: string[],
        index: number
    }>();
    let contract = new Contract(props.contractAddress);

    let { data, pending } = useAsyncData(async () => await contract.getMembersByAddresses(props.memberAddresses));

</script>


<template>
    <div class="modal fade" :id="`approved_members_${props.index}`">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Список подтвердивших участников</h1>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                
                <div class="modal-body">
                    <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>            
                    </div>

                    <ul v-auto-animate>
                        <li v-for="member in data">
                            {{ member.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
