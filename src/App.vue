<template>
    <div id="app">
        <el-card>
            <div slot="header">
                <el-input placeholder="请输入化学方程式" v-model="equationInput" autofocus spellcheck="false" @keyup.enter.native="doBalance">
                    <el-button slot="append" type="primary" @click="doBalance">配平</el-button>
                </el-input>
            </div>

            <el-alert v-if="alert" class="balance-alert" show-icon :closable="false"
                :type="alert.type" :title="alert.title" :description="alert.description"></el-alert>
            <ParseErrorPosition v-if="alert && alert.position"
                :lineContent="alert.position.lineContent" :column="alert.position.column"/>

            <div class="balance-output-box" v-if="equation">
                <EquationView :equation="equation" :coefs="coefs" />
            </div>

            <el-divider v-if="equation || alert"></el-divider>

            <div class="examples">
                <p>点击加载示例: </p>
                <ul>
                    <li v-for="(eq, idx) in examples" :key="idx" @click="loadAndBalance(eq)">{{ eq }}</li>
                </ul>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EquationView from './components/chemistry/EquationView.vue';
import ParseErrorPosition from './components/ParseErrorPosition.vue';
import { Equation } from './engine/chemistry';
import { Parser } from './engine/parser';
import { balance, SolveError } from './engine/solver';

type AlertType = {
    type: string,
    title: string,
    description: string,
    position?: {
        lineContent: string,
        column: number
    }
};

export default Vue.extend({
    name: 'App',
    components: {
        EquationView,
        ParseErrorPosition
    },
    data() {
        return {
            equationInput: "P4 + Ba(OH)2 + H2O = Ba(H2PO2)2 + PH3",
            equation: undefined as (Equation | undefined),
            coefs: undefined as (number[] | undefined),
            alert: undefined as (AlertType | undefined),

            examples: [
                'H2 + O2 = H2O',
                'O2 + CH4 = H2O + CO2',
                'S + HNO3 = H2SO4 + NO2 + H2O',
                'Na2Cr2O7 + S -> Cr2O3 + Na2SO4',
                'P4 + Ba(OH)2 + H2O = Ba(H2PO2)2 + PH3',
                'AgBr + Na2S2O3 -> Na3[Ag(S2O3)2] + NaBr',
                'Fe3C + HNO3 = Fe(NO3)3 + NO2 + CO2 + H2O',
                'K2MnO4 + H2SO4 -> KMnO4 + MnO2 + K2SO4 + H2O',
                'K4Fe(CN)6 + KMnO4 + H2SO4 = CO2 + KNO3 + H2O + K2SO4 + MnSO4 + Fe2(SO4)3',
                'K4[Fe(SCN)6] + K2Cr2O7 + H2SO4 -> Fe2(SO4)3 + Cr2(SO4)3 + CO2 + H2O + K2SO4 + KNO3',
            ]
        };
    },
    methods: {
        clear() {
            this.equation = undefined;
            this.coefs = undefined;
            this.alert = undefined;
        },
        loadAndBalance(eq: string) {
            this.equationInput = eq;
            this.doBalance();
        },
        doBalance() {
            this.clear();
            try {
                const equation = new Parser(this.equationInput).parse();
                this.equation = equation;
                this.coefs = balance(equation);
            } catch (e) {
                console.warn(e);

                e.message && (e = e.message);
                if (e === SolveError.ALL_ZERO) {
                    this.alert = {
                        type: 'warning',
                        title: '配平失败',
                        description: '该方程无有效解'
                    };
                    return;
                } else if (e === SolveError.MULTIPLE_SULUTIONS) {
                    this.alert = {
                        type: 'warning',
                        title: '配平失败',
                        description: '存在多个不为倍数关系的解'
                    };
                    return;
                } else if (e.startsWith('invalid syntax')) {
                    const match = /^invalid syntax at line (\d)+ col (\d+):\n{2}\s{2}([^\n]+)$/m.exec(e);
                    if (match) {
                        const col = parseInt(match[2]), content = match[3];
                        this.alert = {
                            type: 'error',
                            title: '语法错误',
                            description: '方程式解析失败',
                            position: {
                                lineContent: content,
                                column: col
                            }
                        };
                        return;
                    }
                }

                this.alert = {
                    type: 'error',
                    title: '未知错误',
                    description: e
                };
            }
        }
    },
    mounted() {
        this.doBalance();
    }
});
</script>

<style lang="scss">
#app {
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 
                'PingFang SC', 'Microsoft YaHei', 'Source Han Sans SC', 'Noto Sans CJK SC', sans-serif;
    font-size: 20px;
    color: #1a1a1a;
    margin: 10vmin 20vmax;
}

.balance-alert.el-alert {
    max-width: 50%;
    margin: 0 auto;
}

.balance-output-box {
    text-align: center;
    font-size: 26px;
    padding: 2em 0;
}

.examples {
    ul {
        list-style-type: none;
    }
    li {
        padding: 12px 8px;
        cursor: pointer;
    }
}
</style>
