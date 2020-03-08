<template>
    <span class="chem-equation">
        <EquationSideView side="left" :terms="equation.leftSide"/>
        <span class="chem-equation-arrow"> -> </span>
        <EquationSideView side="right" :terms="equation.rightSide"/>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EquationSideView from './EquationSideView.vue';
import { Equation } from '@/engine/chemistry';

@Component({
    name: 'EquationView',
    components: {
        EquationSideView
    }
})
export default class EquationView extends Vue {
    @Prop({ required: true }) equation!: Equation;
}
</script>

<style lang="scss">
    .chem-equation {
        font-family: 'Consolas';
    }
</style>