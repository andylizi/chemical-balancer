<template>
    <span class="chem-component">
        <span class="chem-element-symbol">{{ component.symbol }}</span>
        <sub v-if="component.count > 1">{{ component.count }}</sub>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Component as ChemComponent } from '@/engine/chemistry';

@Component({
    name: 'ComponentView'
})
export default class ComponentView extends Vue {
    @Prop({ required: true }) component!: ChemComponent;
}
</script>

<style lang="scss">

</style>
