const MyEmitter = require('events');

const myEmitter = new MyEmitter();
// Only do this once so we don't loop forever
myEmitter.once('newListener', (event, listener) => {
    if (event === 'event') {
        // Insert a new listener in front
        myEmitter.on('event', () => {
            console.log('B');
        });
    }
});
myEmitter.on('event', () => {
    console.log('A');
});
myEmitter.emit('event');
myEmitter.emit('event');


myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(MyEmitter.listenerCount(myEmitter, 'event'));


function bad() {
    require('fs').readFile('/',function(err){
        if(err)
            console.log("err");
    });
}
bad();



var fs = require('fs');
fs.watch('./src',  (event, filename) => {
    if (filename)
        console.log(filename);
    // Prints: <Buffer ...>
});

// Prints:
//   B
//   A
