<template>
    <div id="app">
        <div v-for="(equation, idx) in equations" :key="idx">
            <EquationView :equation="equation" :coefs="coefs[idx]" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EquationView from './components/chemistry/EquationView.vue';
import { Equation } from './engine/chemistry';

export default Vue.extend({
    name: 'App',
    components: {
        EquationView
    },
    props: {
        equations: {
            type: Array as () => Equation[],
            required: true
        },
        coefs: {
            type: Array as () => number[][]
        }
    }
});
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
