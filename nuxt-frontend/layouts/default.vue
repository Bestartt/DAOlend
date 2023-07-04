<template>

    <main>
      <Navbar />
      <notification></notification>
      <div px-5 md:px-24 block bg-gray-1 style="min-height: 90vh;">
        <slot/>
      </div>
      
      <footer />
    </main>

</template>
