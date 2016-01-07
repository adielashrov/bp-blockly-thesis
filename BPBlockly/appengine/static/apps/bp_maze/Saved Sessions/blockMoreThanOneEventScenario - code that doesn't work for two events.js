bp.addBThread('', 100, function () {
    var blocked_events = [];
    var breakupon_events = [];


    breakupon1: {
        breakupon_events.push(([('left'), ('right')]))
        while (true) {
            Maze.checkTimeout('2');
            yield({
                request: [('forward')],
                wait: breakupon_events,
                block: blocked_events
            });
            if (findEvent(breakupon_events[0], bp.lastEvent) && ([('forward')].indexOf(bp.lastEvent) == -1)) break breakupon1
            console.log(breakupon_events);
            console.log(bp.lastEvent)
        }

    }
    breakupon_events.pop()
    while (true) {
        Maze.checkTimeout('8');
        yield({
            request: [('right')],
            wait: breakupon_events,
            block: blocked_events
        });
        console.log(breakupon_events);
        console.log(bp.lastEvent)
    }

});
bp.addBThread('', 100, function () {
    var blocked_events = [];
    var breakupon_events = [];

    while (true) {
        Maze.checkTimeout('11');
        yield({
            request: [('left')],
            wait: breakupon_events,
            block: blocked_events
        });
        console.log(breakupon_events);
        console.log(bp.lastEvent)
    }

});