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
    box-shadow: 0 10px 40px rgb(216, 216, 216);
    border-radius: 10px;
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


</style>