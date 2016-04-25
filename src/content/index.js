/**
 * Created by abrar on 4/24/16.
 */
var $ziprip = require('ziprip');
console.log("asdasd");
window.onload = function (e) {
    var addresses = $ziprip.extract(document, document.location.href);
    console.log(addresses);
}
//
//