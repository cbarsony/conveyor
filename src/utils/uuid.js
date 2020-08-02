/* DO WTF YOU WANT TO PUBLIC LICENSE
Version 2, December 2004

Copyright (C) 2011 Alexey Silin <pinkoblomingo@gmail.com>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

  DO WTF YOU WANT TO PUBLIC LICENSE
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

0. You just DO WTF YOU WANT TO. */

export const uuid = function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}
