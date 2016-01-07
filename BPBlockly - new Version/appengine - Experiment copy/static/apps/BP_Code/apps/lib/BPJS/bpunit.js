/**
 * Unit testing for BP.js programs
 */

__SEQ__ = "";

function emit(x) {
    __SEQ__ += x;
}

function BTest(name, spec) {
    this.name = name;
    this.bthreads = spec.bthreads;
    this.priorities = spec.priorities;
    this.expected = spec.expected;
    this.ok = undefined;
    this.bprogram = new BProgram();
    this.bprogram.addAll(this.bthreads, this.priorities);
}

BTest.prototype.run = function() {
    __SEQ__ = "";
    this.bprogram.run();
    this.actual = __SEQ__;
    this.ok = __SEQ__ == this.expected;
};

function BSuite(suite) {
    this.tests = [];
    for (var key in suite) {
        var spec = suite[key];
        var test = new BTest(key, spec);
        this.tests.push(test);
    }
}

BSuite.prototype.run = function() {
    for (var i=0; i<this.tests.length; i++) {
        var test = this.tests[i];
        test.run();
    }
};

BSuite.prototype.report = function(render, finish) {
    var passed = 0;
    var failed = 0;
    for (var i=0; i<this.tests.length; i++) {
        var test = this.tests[i];
        render(test.name, test.ok, test.expected, test.actual);
        if (test.ok) passed++; else failed++;
    }
    var total = passed + failed;
    finish(total, passed, failed);
};