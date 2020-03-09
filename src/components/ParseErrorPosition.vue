<template>
    <div class="box">
        <div class="line">
            <span class="pre-error">{{ preErrorContent }}</span>
            <span class="error">{{ errorContent }}</span>
            <span class="post-error">{{ postErrorContent }}</span>
        </div>
        <div class="cursor">{{ cursorLine }}</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'ParseErrorPosition',
    props: {
        column: {
            type: Number as () => number,
            required: true
        },
        lineContent: {
            type: String as () => string,
            required: true
        }
    },
    computed: {
        preErrorContent(): string {
            return this.lineContent.substring(0, this.column - 1);
        },
        errorContent(): string {
            return this.lineContent[this.column - 1];
        },
        postErrorContent(): string {
            return this.lineContent.substring(this.column);
        },
        cursorLine(): string {
            return Array(this.column).join(' ') + '^'
        }
    }
});
</script>

<style scoped lang="scss">
    .box {
        font-family: "Lucida Console", Monaco, monospace;
        font-size: 18px;
        margin: 1em;
        padding: .5em;
        white-space: pre;
    }

    .error {
        text-decoration: red dotted underline;
    }

    .cursor {
        color: red;
    }
</style>