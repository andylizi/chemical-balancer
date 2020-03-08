<template>
    <div id="app">
        <div v-for="(equation, idx) in equations" :key="idx">
            <EquationView :equation="equation" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EquationView from './components/chemistry/EquationView.vue';
import { Equation } from './engine/chemistry';

@Component({
    name: 'App',
    components: {
        EquationView
    }
})
export default class App extends Vue {
    @Prop({ required: true })
    private equations!: Array<Equation>;
}
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
