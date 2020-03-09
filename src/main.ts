import Vue from 'vue';
import App from './App.vue';
import './plugins/element.js';
import { Parser } from './engine/parser';
import { balance } from './engine/solver';
import { Equation } from './engine/chemistry';

const formulars = [
    "H2 + O2 = H2O",
    "Mg(OH)2 = MgO + H2O",
    "H2O2 = H2O + O2",
    "(NH4)2SO4 + CaCO3 -> (NH4)2CO3 + CaSO4",
    "AgBr + Na2S2O3 -> Na3[Ag(S2O3)2] + NaBr",
    "(CuOH)2CO3 -> CuO + CO2 + H2O"
];
const eqs: Equation[] = [];
const coefs: number[][] = [];
for (const formular of formulars) {
    const eq = new Parser(formular).parse();
    eqs.push(eq);
    coefs.push(balance(eq));
}

Vue.config.devtools = true;
Vue.config.productionTip = false;

new Vue({
    render: h => h(App, {
        props: {
            equations: eqs,
            coefs: coefs
        }
    }),
}).$mount('#app');
