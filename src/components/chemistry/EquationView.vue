<template>
    <span class="chem-equation">
        <EquationSideView side="left" :terms="equation.leftSide" :coefs="leftHandSideCoefs"/>
        <span class="chem-equation-arrow"> → </span>
        <EquationSideView side="right" :terms="equation.rightSide" :coefs="rightHandSideCoefs"/>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import EquationSideView from './EquationSideView.vue';
import { Equation } from '@/engine/chemistry';

export default Vue.extend({
    name: 'EquationView',
    components: {
        EquationSideView
    },
    props: {
        equation: {
            type: Object as () => Equation,
            required: true
        },
        coefs: {
            type: Array as () => number[]
        }
    },
    watch: {
        coefs: {
            immediate: true,
            handler(coefs) {
                if (coefs) {
                    const {leftSide: lhs, rightSide: rhs} = this.equation;
                    if (this.coefs.length !== (lhs.length + rhs.length))
                        throw new Error('Invalid equation coefficients');
                }
            }
        }
    },
    computed: {
        leftHandSideCoefs(): number[] {
            return this.coefs?.slice(0, this.equation.leftSide.length);
        },
        rightHandSideCoefs(): number[] {
            return this.coefs?.slice(this.equation.leftSide.length);
        }
    }
});
</script>

<style lang="scss">
    .chem-equation {
        font-family: 'Consolas';
    }
</style>