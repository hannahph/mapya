 function printI(i) {
   return new Promise(resolve => {
     setTimeout(() => {
       resolve(i);
     }, i*2000);
   });
 }

// async function msg(i) {
//     const msg = await printI(i);
//     console.log('Message:', msg);
// }

// for (var i =0; i<10; i++){
//     msg(i); // Message: 🤡 <-- after 2 seconds
// }


//var promise1 = Promise.resolve(3);
//var promise2 = printI(1)
//var promise3 = new Promise(function(resolve, reject) {
//  setTimeout(resolve, 100, 'foo');
//});

var mylist = []

for (var i=0; i<10; i++){
    mylist.push(printI(i))
}

Promise.all(mylist).then(function(values) {
  console.log(values);
});