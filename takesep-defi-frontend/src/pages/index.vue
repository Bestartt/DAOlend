<script setup lang="ts" generic="T extends any, O extends any">
  import { get_my_union } from '~/localstorage';

  let myorg = get_my_union();
</script>

<template>

  <div flex flex-col items-center>
    <h1 mt-16>Takesep DeFi</h1>
    <span>Введите свои отчеты прозрачно через блокчейн</span>


    <div flex gap-2 mt-3>
      <router-link to="unions/my" v-if="myorg != null" class="btn btn-outline-dark">перейти к моей организации</router-link>
    </div>    
  </div>  

  <br>


  <div flex justify-center>
    <div max-w-800px class="row gap-2">
      <div class="col-5 card card-body">
        <p class="card-text">
          Хотите использовать собственную систему?
          создайте свою организацию за пару кликов        
        </p>

      
        <router-link to="/unions/create" class="btn btn-dark">создать</router-link>
      </div>

      <div class="col-5 card card-body">
        <p class="card-text">
          Или можете вступить в другую организацию. Просто введите адрес организации
        </p>

        <router-link to="/unions/search" class="btn btn-dark">найти</router-link>
      </div>
    </div> 
  </div>

  
    
</template>
