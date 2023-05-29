<script lang="ts" setup>
    import { requestAccount } from '~/crypto';

</script>

<template>
    <h3>Профиль</h3>

    <button @click="requestAccount()" class="btn btn-dark">подключить аккаунт</button>

</template>
