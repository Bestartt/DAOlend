<template>
    <nav class="navbar navbar-expand-md bg-body-tertiary" bg-gray-1>
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">Главная</router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/unions/my" class="nav-link">моя организация</router-link>
                    </li>
                    <li class="nav-item">
                    <router-link to="/profile" class="nav-link">профиль</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/requests" class="nav-link">мои запросы</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
