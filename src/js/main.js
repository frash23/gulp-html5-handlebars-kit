/* Sample main.js. Imports a module and exports it to the window
 * object so you can call properties from it in your console for
 * testing */

import $ from './nq';
import * as mod from './Module';

window.$ = $;
window.mod = mod;
