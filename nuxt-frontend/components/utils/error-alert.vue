<script lang="ts" setup>

    function reload() {
        location.reload();
    }


</script>



<template>
    <div class="alert alert-danger my-3" role="alert">
        <h5><b>Ошибка!</b></h5>

        <p>
            Не удалось загрузить данные, проверьте подключен ли Metamask или интернет-подключение
            <br>    
            Или попробуйте перезагрузить страницу
        </p>

        <button class="btn btn-outline-danger" @click="reload()">перезагрузить</button>
    </div>
</template>


<style scoped>
    .my-alert {
        border-left: 2px solid rgb(255,71,87);
        color: #ff4757;
        background-color: #ffecee;
        border-radius: 0 12px 12px 0;
        font-size: .9rem;
        padding: 10px 20px;
        transition: max-height .3s ease-out;
        overflow: hidden;
    }
</style>
