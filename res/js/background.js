chrome.app.runtime.onLaunched.addListener(function(){
  chrome.app.window.create('window.html', {
    'bounds':{
      'width': 400,
      'height': 600 // 550
    },
    minWidth: 400,
    minHeight: 550,
    maxWidth: 960,
    maxHeight: 1015,
    "resizable": false
  })
})