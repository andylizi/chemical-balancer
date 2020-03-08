<template>
    <span :class="`chem-equation-${side}`">
        <template v-for="(term, idx) in terms">
            <template v-if="idx != 0"> + </template>
            <GroupView :key="term.uid" :value="term"/>
        </template>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import GroupView from './GroupView.vue';
import { Term } from '@/engine/chemistry';

@Component({
    name: 'EquationSideView',
    components: {
        GroupView
    }
})
export default class EquationSideView extends Vue {
    @Prop({ required: true }) terms!: Array<Term>;
    @Prop({ required: true }) side!: string;
}
</script>

<style lang="scss">

</style>