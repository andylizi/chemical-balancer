<template>
    <span :class="isGroup(value) ? 'chem-term' : 'chem-group'">
        <template v-if="isGroup(value)">
            <span class="chem-group-left-bracket">(</span>
            <template v-for="component in value.components">
                <ComponentView v-if="!isGroup(component)"  :key="component.uid" :component="component"/>
                <GroupView v-else :key="component.uid" :value="component"/>
            </template>
            <span class="chem-group-right-bracket">)</span>
            <sub v-if="value.count > 1" class="chem-group-count">{{ value.count }}</sub>
        </template>
        <template v-else>
            <span v-if="coef > 1" class="chem-term-coefficient">{{ coef }}</span>
            <template v-for="component in value.components">
                <ComponentView v-if="!isGroup(component)" :key="component.uid" :component="component"/>
                <GroupView v-else :key="component.uid" :value="component"/>
            </template>
        </template>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ComponentView from './ComponentView.vue';
import { Group, Term } from '@/engine/chemistry';

@Component({
    name: 'GroupView',
    components: {
        ComponentView
    }
})
export default class GroupView extends Vue {
    @Prop({ required: true }) value!: Group | Term;
    @Prop() coef?: number;

    isGroup(item: { type: string }) {
        return item.type === 'group';
    }
}
</script>

<style lang="scss">
    .chem-term-coefficient {
        color: #097ffb;
    }
</style>
