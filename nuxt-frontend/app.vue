<template>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;0,500;0,700;1,400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=PT+Sans&family=Ubuntu:ital,wght@0,400;0,500;0,700;1,400&display=swap');

  .page-enter-active,
  .page-leave-active {
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }

  html,
  body,
  #app {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'PT sans', sans-serif;
    color: #3c3c3c;
  }

  html.dark {
    background: #121212;
  }


  h1, h2, h3, h4 {
    font-family: 'Ubuntu', sans-serif;
  }

  .card, .navbar {
    box-shadow: 0 5px 15px rgb(241, 241, 241);
    border-radius: 10px;
    transition: 0.4s;
  }

  .card:hover {
    box-shadow: 0 5px 15px rgb(226, 226, 226);
  }

  .navbar {
    box-shadow: 0 10px 40px rgb(239, 239, 239);
    border-radius: 10px;
    position: sticky;
  }

  .no-shadow {
    box-shadow: none;
  }

  .center {
    @apply flex flex-col items-center;
  }

  .btn {
    border-radius: 10px;
  }

  .btn-dark {
    box-shadow: 0 10px 20px rgb(180, 180, 180);
    transition: 0.3;
  }

  .btn-dark:hover {
    box-shadow: 0 10px 20px rgb(217, 217, 217);
  }

  .btn-danger {
    box-shadow: 0 10px 20px rgb(255, 188, 188);
    transition: 0.3;
  }

  .btn-danger:hover {
    box-shadow: 0 10px 20px rgb(255, 215, 215);
    background-color: #dc3f4e 
  }

  .my-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 0;   
        height: 0;
        transform: translate(-50%, -50%);
        z-index: inherit;
        transition: 0.3s;
    }

    .my-modal-active {
        width: 100vw;
        height: 100vh;
        display: block;
        background-color:rgba(0, 0, 0, 0.426);
        backdrop-filter: blur(3px);
    }

    .my-modal-dialog {
        width: 0;
        height: 0;
        overflow: hidden;
        position: fixed;
        border-radius: 10px;
        transition: 0.4s;
        z-index: 11;
        
        display: flex;
        flex-direction: column;
        box-shadow: 0 5px 30px 0 rgba(0,0,0, 0.05);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
    }

    .my-dialog-active {
        height: auto;
        z-index: 9999;
        width: 500px;
    }

    .btn-close {
        padding: 10px 10px;
        box-shadow: 0px 0px 10px gray;
    }

    .dark-link {
        text-underline-offset: 0.25em!important;
        color: #3a3a3a;
        text-decoration-color: #959595;
        transition: all 0.5s;
    }

    .dark-link:hover {
        color: black;
        font-weight: 115%;
        text-decoration-color: black;
    }

</style>