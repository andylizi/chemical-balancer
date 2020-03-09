<template>
    <span :class="{ 'chem-term': !isGroup(model), 'chem-group': isGroup(model) }">
        <template v-if="isGroup(model)">
            <span class="chem-group-left-bracket">(</span>
            <template v-for="item in model.components">
                <ComponentView v-if="!isGroup(item)" :key="item.uid" :model="item"/>
                <GroupView v-else :key="item.uid" :model="item"/>
            </template>
            <span class="chem-group-right-bracket">)</span>
            <sub v-if="model.count > 1" class="chem-group-count">{{ model.count }}</sub>
        </template>
        <template v-else>
            <span v-if="coef > 1" class="chem-term-coefficient">{{ coef }}</span>
            <template v-for="item in model.components">
                <ComponentView v-if="!isGroup(item)" :key="item.uid" :model="item"/>
                <GroupView v-else :key="item.uid" :model="item"/>
            </template>
        </template>
    </span>
</template>

<script lang="ts">
import Vue from 'vue';
import ComponentView from './ComponentView.vue';
import { Group, Term } from '@/engine/chemistry';

export default Vue.extend({
    name: 'GroupView',
    components: {
        ComponentView
    },
    props: {
        model: {
            type: Object as () => Group | Term,
            required: true
        },
        coef: {
            type: Number as () => number | undefined
        }
    },
    methods: {
        isGroup(item: { type: string }) {
            return item.type === 'group';
        }
    }
})
</script>

<style lang="scss">
    .chem-term-coefficient {
        color: #097ffb;
    }
</style>
