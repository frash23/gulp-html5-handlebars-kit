/* Example module to demonstrate the import functionality */

export function log() { console.log('You called log() in Module.js!'); };
export var variable = 'I\'m a member of Module.js, nice to meet you!';
var def = 'I\'m the default value.';
export default def;
