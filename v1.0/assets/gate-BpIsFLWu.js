var e=`/* Acesso ao protótipo: confere a senha por hash SHA-256 (a senha em si não fica no código). */
(function(){
  var SALT='sctec-emp-2026';
  var HASH='20b2fed05b1a1df1ba1ffd3a8e8c0023b7d2b714cc05720c239edaa3280fdebd';
  var KEY='sctec_acesso';

  function read(store){try{return window[store].getItem(KEY)}catch(e){return null}}
  function ok(){return read('sessionStorage')===HASH||read('localStorage')===HASH}

  function sha256(text){
    var data=new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256',data).then(function(buf){
      return Array.prototype.map.call(new Uint8Array(buf),function(b){return ('0'+b.toString(16)).slice(-2)}).join('');
    });
  }

  function login(password,remember){
    return sha256(SALT+password).then(function(h){
      if(h!==HASH)return false;
      try{(remember?localStorage:sessionStorage).setItem(KEY,HASH)}catch(e){}
      return true;
    });
  }

  function logout(){
    try{sessionStorage.removeItem(KEY);localStorage.removeItem(KEY)}catch(e){}
  }

  window.SCTEC_GATE={ok:ok,login:login,logout:logout};
})();
`;export{e as default};