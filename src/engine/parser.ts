import moo, { Token } from 'moo';
import { Equation, Group, Term } from './chemistry';
import { newEquation, newComponent, newGroup, newTerm } from './chemistry';
import { isNull, isFalsy, Stack } from '@/utils';

enum State {
    SYMBOL_GS_SPACE = 'symbol|group_start|space',
    SYMBOL_GS_GE_COUNT_EOT = 'symbol|group_start|group_end|count|eot',
    SYMBOL_GS = 'symbol|group_start',
    SYMBOL_GS_GE_EOT = 'symbol|group_start|group_end|eot',
    SPACE_OPERATOR_BEFORE = 'space|operator before'
}

enum Type {
    SYMBOL = 'symbol',
    COUNT = 'count',
    GROUP_START = 'group_start',
    GROUP_END = 'group_end',
    SPACE = 'space',
    CONJUNCTION = 'conjunction',
    ARROW = 'arrow'
}

const matchers = {
    symbol: /[A-Z][a-z]*/,
    count: /[2-9]|[1-9][0-9]+/,
    group_start: ['(', '['],
    group_end: [')', ']'],
    space: /\s+/,
    conjunction: '+',
    arrow: /-+>|→|=+>?/
};

/*
symbol_gs_space 'symbol' -> symbol_gs_ge_count_eot;
symbol_gs_space 'group_start' -> symbol_gs;
symbol_gs_space 'space' -> symbol_gs_space;

symbol_gs_ge_count_eot 'symbol' -> symbol_gs_ge_count_eot;
symbol_gs_ge_count_eot 'group_start' -> symbol_gs;
symbol_gs_ge_count_eot 'group_end' -> symbol_gs_ge_count_eot;
symbol_gs_ge_count_eot 'count' -> symbol_gs_ge_eot;
symbol_gs_ge_count_eot 'space' -> space_operator_before;
symbol_gs_ge_count_eot 'operator' -> symbol_gs_space;

symbol_gs 'symbol' -> symbol_gs_ge_count_eot;
symbol_gs 'group_start' -> symbol_gs;

symbol_gs_ge_eot 'symbol' -> symbol_gs_ge_count_eot;
symbol_gs_ge_eot 'group_start' -> symbol_gs;
symbol_gs_ge_eot 'group_end' -> symbol_gs_ge_count_eot;
symbol_gs_ge_eot 'space' -> space_operator_before;
symbol_gs_ge_eot 'operator' -> symbol_gs_space;

space_operator_before 'space' -> space_operator_before;
space_operator_before 'operator' -> symbol_gs_space;
*/

const lexerRules: Record<string, moo.Rules> = {
    [State.SYMBOL_GS_SPACE]: {
        [Type.SYMBOL]: { match: matchers.symbol, next: State.SYMBOL_GS_GE_COUNT_EOT },
        [Type.GROUP_START]: { match: matchers.group_start, next: State.SYMBOL_GS },
        [Type.SPACE]: { match: matchers.space, lineBreaks: true }
    },
    [State.SYMBOL_GS_GE_COUNT_EOT]: {
        [Type.SYMBOL]: { match: matchers.symbol, next: State.SYMBOL_GS_GE_COUNT_EOT },
        [Type.GROUP_START]: { match: matchers.group_start, next: State.SYMBOL_GS },
        [Type.GROUP_END]: { match: matchers.group_end, next: State.SYMBOL_GS_GE_COUNT_EOT },
        [Type.COUNT]: { match: matchers.count, next: State.SYMBOL_GS_GE_EOT },
        [Type.SPACE]: { match: matchers.space, lineBreaks: true, next: State.SPACE_OPERATOR_BEFORE },
        [Type.CONJUNCTION]: { match: matchers.conjunction, next: State.SYMBOL_GS_SPACE },
        [Type.ARROW]: { match: matchers.arrow, next: State.SYMBOL_GS_SPACE }
    },
    [State.SYMBOL_GS]: {
        [Type.SYMBOL]: { match: matchers.symbol, next: State.SYMBOL_GS_GE_COUNT_EOT },
        [Type.GROUP_START]: { match: matchers.group_start, next: State.SYMBOL_GS }
    },
    [State.SYMBOL_GS_GE_EOT]: {
        [Type.SYMBOL]: { match: matchers.symbol, next: State.SYMBOL_GS_GE_COUNT_EOT },
        [Type.GROUP_START]: { match: matchers.group_start, next: State.SYMBOL_GS },
        [Type.GROUP_END]: { match: matchers.group_end, next: State.SYMBOL_GS_GE_COUNT_EOT },
        [Type.SPACE]: { match: matchers.space, lineBreaks: true, next: State.SPACE_OPERATOR_BEFORE },
        [Type.CONJUNCTION]: { match: matchers.conjunction, next: State.SYMBOL_GS_SPACE },
        [Type.ARROW]: { match: matchers.arrow, next: State.SYMBOL_GS_SPACE }
    },
    [State.SPACE_OPERATOR_BEFORE]: {
        [Type.SPACE]: { match: matchers.space, lineBreaks: true },
        [Type.CONJUNCTION]: { match: matchers.conjunction, next: State.SYMBOL_GS_SPACE },
        [Type.ARROW]: { match: matchers.arrow, next: State.SYMBOL_GS_SPACE }
    }
};

export class Parser {
    private lexer: moo.Lexer;

    private equation: Equation = newEquation();
    private stack: Stack<Group | Term> = new Stack();
    private rightSide: boolean = false;


    constructor(public readonly content: string) {
        this.lexer = moo.states(lexerRules, State.SYMBOL_GS_SPACE);
        this.lexer.reset(content);
    }

    parse(): Equation {
        let token: Token;
        let termEnd = false;

        const throwError = (msg = 'invalid syntax'): never => {
            throw new Error(this.lexer.formatError(token, 'invalid syntax'));
        };

        const pushTerm = () => {
            const last = this.stack.pop();
            if (!isNull(last)) {
                if (last.type !== 'term') throwError();
                else {
                    const {equation} = this;
                    (this.rightSide ? equation.rightSide : equation.leftSide).push(last);
                }
            }

            termEnd = false;
        };

        for (token of this.lexer) {
            // console.log({
            //     type: token.type,
            //     value: token.value,
            //     state: this.lexer.save().state
            // });

            switch (token.type) {
                case Type.SYMBOL: {
                    const component = newComponent(token.value);
                    const last = this.stack.lastOrPush(() => newTerm());
                    last.components.push(component);
                    break;
                }
                case Type.COUNT: {
                    const last = this.stack.lastOrReturn(throwError);
                    const {components} = last;
                    if (components.length === 0) throwError();
                    components[components.length - 1].count = parseInt(token.value);
                    break;
                }
                case Type.GROUP_START: {
                    const group = newGroup();
                    this.stack.push(group);
                    break;
                }
                case Type.GROUP_END: {
                    const group = this.stack.pop();
                    if (isFalsy(group) || group.type !== 'group') {
                        throwError();
                    } else {
                        const parent = this.stack.lastOrPush(() => newTerm());
                        parent.components.push(group);
                    }
                    break;
                }
                case Type.SPACE:
                case Type.CONJUNCTION: {
                    termEnd = true;
                    break;
                }
                case Type.ARROW: {
                    if (!this.rightSide) this.rightSide = true;
                    else throwError();
                    termEnd = true;
                    break;
                }
            }

            if (termEnd) {
                pushTerm();
            }
        }
        pushTerm();

        return this.equation;
    }
}
