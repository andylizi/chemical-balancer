<template>
    <span class="chem-component">
        <span class="chem-element-symbol">{{ model.symbol }}</span>
        <sub v-if="model.count > 1">{{ model.count }}</sub>
    </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component as ChemComponent } from '@/engine/chemistry';

export default Vue.extend({
    name: 'ComponentView',
    props: {
        model: {
            type: Object as () => ChemComponent,
            required: true
        }
    }
});
</script>

<style lang="scss">

</style>
