<script setup lang="ts">
    import { useNotification } from "../store";

    let notif = useNotification();

</script>


<template>
    <div class="card notification-card" :style="{ top: notif.isOpen ? `10px` : `-550px` }">
        <div class="card-body">
            <div flex justify-between>
                <b>{{ notif.title }}</b>
                <button class="btn btn-sm btn-close" @click="notif.close()"></button>
            </div>
            

            <p>{{ notif.description }}</p>
            <template v-if="notif.link !== ''">
                <router-link :to="notif.link" class="btn btn-dark">link</router-link>
            </template>
            
            
        </div>
    </div>    
</template>


<style>

    .notification-card {
        max-width: 600px;
        min-width: 300px !important;
        position: absolute !important;
        top: 10px;
        right: 10px;

        transition: 0.3s;
    }

</style>
