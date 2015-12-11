viewSizeX = 512;
viewSizeY = 512;
coeff = 20;

var id;
var mousePos;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
id = ctx.createImageData(viewSizeX,viewSizeY);    
 
setInterval(function(){ updateCanvas() }, 40);
 
c.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(c, evt);
}, false);        
      
function updateCanvas() {
    renderScene(mousePos.x,mousePos.y);
}
    
function generate(start, end, n) {
    var data = new Array(n);
    data[0] = start;
    data[n-1] = end;
    
    for(j=n-1; j>=2; j/=2)
    {
        for(i=0; i<n-1; i+=j)
        {
            ind1 = i;
            ind2 = i + j;
            
            pt1 = data[ind1];
            pt2 = data[ind2];
            
            // convert coordinates                
            newX = ((pt1 % viewSizeX) + (pt2 % viewSizeX)) /2;
            newY = ((pt1/viewSizeX) + (pt2/viewSizeX)) / 2;
            
            // add some random noise                
            newX += (coeff * Math.random()) - (coeff/2);
            newY += (coeff * Math.random()) - (coeff/2);
                            
            newX = Math.floor(newX);
            newY = Math.floor(newY);
            
            // Limit to the image boundaries
            if(newX < 0) {
                newX = 0;
            }
            
            if(newY < 0) {
                newY = 0;
            }        

            if(newX >= viewSizeX) {
                newX = viewSizeX - 1;
            }
            
            if(newY >= viewSizeY) {
                newY = viewSizeY - 1;
            }                    
            
            //convert back
            pt = (newY * viewSizeX) + newX;
            
            //console.log(newX, newY, pt);
            data[Math.floor(i + j/2)] = pt;                
        }

        coeff = coeff * 0.5;
    }
    
    return data;
}  

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
} 
    
function renderScene(x, y) { 
    coeff = 200;
    N = 1025;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
 
    start = 0;
    end = y * viewSizeX + x;
    
    // generate main stream
    data = generate(start,end, N);

    d  = id.data;
                        
    //clear buffer
    for(i =0; i< viewSizeX*viewSizeY; i++)
    {
        idx = 4 * i;
        d[idx] *= 0.7;
        d[idx+1] *= 0.7;
        d[idx+2] *= 0.7;
        d[idx+3] = 255;
        
        if(d[idx] < 2)
            d[idx] = 0;
            
        if(d[idx+1] < 2)
            d[idx+1] = 0;

        if(d[idx+2] < 2)
            d[idx+2] = 0;                        
    }        
           
    // draw a stroke
    for(i=0;i<N;i++)
    {                    
        idx = 4 * data[i];
    
        reduce = Math.floor(100 * Math.random());
        d[idx] =   255 - reduce;
        d[idx+1] = 255 - reduce;
        d[idx+2] = 255;
        d[idx+3] = 255;                   
    }

    ctx.putImageData( id, 0, 0 );
}


