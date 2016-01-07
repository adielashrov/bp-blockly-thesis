/**
 * Actuall test suite for BP.js
 */

n = 3; // common number of iterations for tests

bpjs_suite = {
    lower_prio_first : {
        bthreads: {
            high: function() {
                yield({request: ['b']});
                emit('b');
            },
            low: function() {
                yield({request: ['a']});
                emit('a');
            }
        },
        priorities: {low: 1, high: 2},
        expected: "ab"
    },

    chit_chat: {
        bthreads: {
            chit: function() {
                yield({request: ['chit']});
                emit('a');
                yield({wait: ['chat']});
                emit('b');
            },
            chat: function() {
                yield({wait: ['chit']});
                yield({request: ['chat']});
            }
        },
        priorities: {chit: 1, chat: 2},
        expected: "ab"
    },

    wake_only_waiting: {
        bthreads: {
            lead: function() {
                yield({request: ['a']});
                yield({request: ['b']});
                yield({request: ['c']});
            },
            wait1: function() {
                yield({wait: ['a', 'c']});
                emit('a');
                yield({wait: ['a', 'c']});
                emit('c');
            },
            wait2: function() {
                yield({wait: ['b', 'c']});
                emit('b');
            }
        },
        priorities: {wait1: 1, wait2: 2, lead: 3},
        expected: "abc"
    },

    hot_cold: {
        bthreads: {
            addHot: function() {
                for (var i=0; i<n; i++) {
                    yield({request: ['addHot']});
                }
            },
            addCold: function() {
                for (var i=0; i<n; i++) {
                    yield({request: ['addCold']});
                }
            },
            interleave: function() {
                for (var i=0; i<n; i++) {
                    yield({wait: ['addHot'], block: ['addCold']});
                    yield({wait: ['addCold'], block: ['addHot']});
                }
            },
            echo:  function() {
                for (var i=0; i<2*n; i++) {
                    var e = yield({wait: ['addHot', 'addCold']});
                    if (e=='addHot') emit('H');
                    else if(e=='addCold') emit('C');
                }
            }
        },
        priorities: {addHot: 1, addCold: 2, interleave: 3, echo: 4},
        expected: "HCHCHC"
    },

    block_function: {
        bthreads: {
            lead: function() {
                var e;
                e = yield({request: ['a', 'b', 'c']});
                emit(e);
                e = yield({request: ['a', 'b', 'c']});
                emit(e);
            },
            block: function() {
                yield({block: [function(e) { return e >= 'b'; }], wait: ['a']});
                yield({block: [function(e) { return e <= 'b'; }], wait: ['c']});
            }
        },
        priorities: {lead: 1, block: 2},
        expected: "ac"
    },

    wait_function: {
        bthreads: {
            lead: function() {
                yield({request: ['a']});
                emit('a');
                yield({request: ['c']});
            },
            block: function() {
                var e = yield({wait: [function(e) { return e >= 'b'; }]});
                emit(e);
            }
        },
        priorities: {lead: 1, block: 2},
        expected: "ac"
    }
};