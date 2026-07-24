const crypto = require('crypto');
function sha512(str) { return crypto.createHash('sha512').update(str).digest('hex'); }
console.log("hash 1  :", sha512("eFBbV2|19baa66ac9e2bc16a7d8|1|Product|Ankita|ankita@mailinator.com|||||||||||LlziMB5vxHAh3flKIbPcPlSezWag19c0"));
console.log("hash 1.0:", sha512("eFBbV2|19baa66ac9e2bc16a7d8|1.0|Product|Ankita|ankita@mailinator.com|||||||||||LlziMB5vxHAh3flKIbPcPlSezWag19c0"));
console.log("hash 1.00:", sha512("eFBbV2|19baa66ac9e2bc16a7d8|1.00|Product|Ankita|ankita@mailinator.com|||||||||||LlziMB5vxHAh3flKIbPcPlSezWag19c0"));
console.log("hash 1, prod_info:", sha512("eFBbV2|19baa66ac9e2bc16a7d8|1|Product_info|Ankita|ankita@mailinator.com|||||||||||LlziMB5vxHAh3flKIbPcPlSezWag19c0"));
console.log("hash server:", "cad40190b10531b41d863d5e6e318cf45679194111b8c99d4c31144e8df7d3033c8331b355242a25c546fdf0f202b4a7c4b10e21cba0212e5c757fe3a625fe13");
