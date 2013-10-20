// =============================================================================
//
// Copyright (c) 2009-2013 Christopher Baker <http://christopherbaker.net>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// =============================================================================





// function onMessage(evt) 
// {

//     // console.log(evt.data);
//     // messages are sent sent 
//     var message = JSON.parse(evt.data);

//     if(message.method == "setCurrentFrame") {
//         $("#current-frame").text(message.data.frameNum);

//         // console.log(message.error.code);

//     } else {
//         console.log("Unknown method: " + message.method);
//     }

// }

function onOpen(ws) 
{
    ofLogNotice("Connection Opened " + ws);
}


function onClose()
{
  console.log("Connection closed.");
}

function onError()
{
  console.log("Connection Error.");
}

// function init() {
  
// }

$(document).ready( function()
{
    // create the new socket
    var ws = new ofxHTTPBasicWebSocketClient();//['of','off']);

    
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext('2d');
  context.fillStyle = "d0cece";
  context.fillRect(0,0,canvas.width,canvas.height);

  canvas.addEventListener('mousemove', function(evt) {
           
    console.log("mousemove " + evt.clientX + " " + evt.clientY);
     
      // Get the canvas bounding rect
      var canvasRect = canvas.getBoundingClientRect();

      // Now calculate the mouse position values
      y = evt.clientY - canvasRect.top; // minus the starting point of the canvas rect
      x = evt.clientX - canvasRect.left;  // minus the starting point of the canvas rect on the x axis
   
      console.log("mousemove x:" + x + " y:" + y);

      var mousePos = x + ", " + y;
      ws.send(mousePos);

    }, false);  

    // $( "body" ).mousemove(function( event ) {
    //   var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
    //   var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
    //   var mousePos = event.clientX + ", " + event.clientY
    //   //console.log(mousePos);
    //   ws.send(mousePos);

    //   //$( "span:first" ).text( "( event.pageX, event.pageY ) : " + pageCoords );
    //   //$( "span:last" ).text( "( event.clientX, event.clientY ) : " + clientCoords );
    // });      


     $( "canvas" ).click(function() {
    //  // alert( "Handler for .click() called." );
       ws.send("mouseClicked");
       console.log("mouseClicked");
     });

    console.log("here");

    ofLogNotice(ws.getWebSocketURL());

    ofLogNotice(ws.getKeepAliveInterval());

    // // set callbacks
    ws.setOnOpen(onOpen);
    //ws.setOnMessage(onMessage);
    ws.setOnClose(onClose);
    ws.setOnError(onError);




    // // button controls
    // $("#button-white").click(function() {
    //     console.log("Selecting white.");
    //     var message = makeCommandDataMessage("white")
    //     ws.send(message);
    // });
  
    // $("#button-black").click(function() {
    //     console.log("Selecting black.");
    //     var message = makeCommandDataMessage(CMD_SET_BACKGROUND_COLOR,"black");
    //     ws.send(message);   

    // });
    // // connect to the websocket
    ws.connect();

});
