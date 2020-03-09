<template>
    <span :class="`chem-equation-${side}`">
        <template v-for="(term, idx) in terms">
            <span class="chem-equation-plus" v-if="idx != 0" :key="idx"> + </span>
            <GroupView :key="term.uid" :model="term" :coef="coefs ? coefs[idx] : undefined"/>
        </template>
    </span>
</template>

<script lang="ts">
import Vue from 'vue';
import GroupView from './GroupView.vue';
import { Term } from '@/engine/chemistry';

export default Vue.extend({
    name: 'EquationSideView',
    components: {
        GroupView
    },
    props: {
        terms: {
            type: Array as () => Term[],
            required: true,
        },
        side: {
            type: String as () => string,
            required: true
        },
        coefs: {
            type: Array as () => number[] | undefined
        }
    },
    watch: {
        coefs: {
            immediate: true,
            handler(coefs) {
                if (!coefs) return;
                if (coefs.length !== this.terms.length)
                    throw new Error('Invalid equation coefficients');
            }
        }
    },
});
</script>

<style lang="scss">

</style>