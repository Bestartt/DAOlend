<script setup lang="ts" generic="T extends any, O extends any">
  import { get_my_union } from '~/localstorage';

  let myorg = get_my_union();
</script>

<template>

  <div flex flex-col items-center>
    <h1 mt-16>Takesep DeFi</h1>
    <p>Введите свои отчеты прозрачно через блокчейн</p>

    <div flex gap-3>
      <router-link to="/unions/create" class="btn btn-dark">создать организацию</router-link>
      <router-link to="/unions/search" class="btn btn-dark">найти организацию</router-link>
      <router-link to="unions/my" v-if="myorg != null" class="btn btn-outline-dark">перейти к моей организации</router-link>
    </div>    
  </div>  

  
    
</template>
