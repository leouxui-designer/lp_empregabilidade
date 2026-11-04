var e=`/* Acesso ao protótipo: confere a senha por hash SHA-256 (a senha em si não fica no código). */\r
(function(){\r
  var SALT='sctec-emp-2026';\r
  var HASH='20b2fed05b1a1df1ba1ffd3a8e8c0023b7d2b714cc05720c239edaa3280fdebd';\r
  var KEY='sctec_acesso';\r
\r
  function read(store){try{return window[store].getItem(KEY)}catch(e){return null}}\r
  function ok(){return read('sessionStorage')===HASH||read('localStorage')===HASH}\r
\r
  function sha256(text){\r
    var data=new TextEncoder().encode(text);\r
    return crypto.subtle.digest('SHA-256',data).then(function(buf){\r
      return Array.prototype.map.call(new Uint8Array(buf),function(b){return ('0'+b.toString(16)).slice(-2)}).join('');\r
    });\r
  }\r
\r
  function login(password,remember){\r
    return sha256(SALT+password).then(function(h){\r
      if(h!==HASH)return false;\r
      try{(remember?localStorage:sessionStorage).setItem(KEY,HASH)}catch(e){}\r
      return true;\r
    });\r
  }\r
\r
  function logout(){\r
    try{sessionStorage.removeItem(KEY);localStorage.removeItem(KEY)}catch(e){}\r
  }\r
\r
  window.SCTEC_GATE={ok:ok,login:login,logout:logout};\r
})();\r
`;export{e as default};