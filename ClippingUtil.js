function getInternetExplorerVersion(){
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    return rv;
}

var ieVersion = getInternetExplorerVersion();

if(ieVersion != -1 && getInternetExplorerVersion() < 9){
    document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
    clipImageForOldIE('image.jpg');
}
else{
    clipImage('image.jpg','image1','259px','194px');
}

function clipImage(imagePath,imageId,width,height){
    var targetImage;

    // First, create the <canvas> element and insert it into the DOM
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id',imageId);
    canvas.setAttribute('width',width);
    canvas.setAttribute('height',height);
    document.body.appendChild(canvas);

    // Create a new image
    targetImage = new Image();

    // Set an onload function on the images. After the image has been loaded into memory,
    // it will be used to populate the <canvas> element
    targetImage.onload = function(){
        // drawImages() will load the image into the <canvas> element
        // The index of the loop is passed, as well as the image itself
        drawImages(this,imageId);
    };
    // Finally, we set the src of the image, which will trigger the onload function
    // once the image has loaded
    targetImage.src = imagePath;
}

function drawImages(image,imageId){
    var targetImg, context;

    // First, get the relevant <canvas> element
    // (and ensure it exists):
    targetImg = document.getElementById(imageId);

    // Next, since targetImg is a jQuery object
    // the base <canvas> element needs to be extracted
    // This is done using targetImg[0]. The context
    // is then generated from this <canvas> element
    context = targetImg.getContext("2d");

    // Next, the points of the path, which will become the visible part
    // of the image, are drawn:
    //M259,0 L0,0 L10,90 L90,130, L259,0
    context.beginPath();
    context.moveTo(259,0);
    context.lineTo(0, 0);
    context.lineTo(10,90);
    context.lineTo(90, 130);
    context.lineTo(259, 0);

    // Now that the path is drawn, the context is clipped:
    context.clip();

    // And the image is used to fill the path
    context.drawImage(image, 0, 0);
    context.closePath();

}

function clipImageForOldIE(imagePath){
    var el, d, fill;

    // First, create a VML polyline element.
    // This element will be the path that the image is
    // drawn inside.
    el = document.createElement("v:polyline");

    // Next, create a container to hold the polyline, and
    // append the polyline. This step may or may not be required
    // depending on what you will do with the inserted element
    // but it was necessary for me.
    d = document.createElement('div');
    d.appendChild(el);

    // Next, set the CSS position (absolute), height, and width attributes
    // on the polyline. These attrubites were required, as the shape would
    // not render without them, something to do with quirks and standards
    // mode in IE
    el.style.position = "absolute";
    el.style.width = "259px";
    el.style.height = "194px";
    //el.outerHTML = el.outerHTML;
    // Next, set the path. This is the same path used in the canvas example,
    // though unlike the canvas example, this path needs to be explicitly closed
    // whereas the canvas path was self closing.

    el.points.value = "M259,0 L0,0 L10,90 L90,130, L259,0";

    // A border is generated by default, but I did not want this, so stroked is set to false
    el.stroked = false;

    // Finally, we create a VML fill element. This is the element that the image is inserted
    // into, and will be masked by the polyline element
    fill = document.createElement("v:fill");

    // Images require the type to be set to frame
    fill.setAttribute("type", "tile");

    // I found that aspect also needed to be set to atleast for any images that were not
    // aligned with the left side of the container
    /*fill.setAttribute("aspect", "atleast");*/

    // Next, the image is set as the src to the fill:
    fill.setAttribute("src", imagePath);

    // This next tweak shifts the image. I had to play with this manually to get the value exactly
    // where I wanted
    //fill.setAttribute("origin", "0,-0.15");

    // And finally, the fill is appended to the polyline, and the container is inserted into the DOM
    el.appendChild(fill);
    document.body.appendChild(d);

    /*document.getElementById('bodyId').appendChild(el);*/
    // This last step forces a re-rendering of the polyline, which is required for the image to show.
    // I had to scour the web to find this solution!
    el.outerHTML = el.outerHTML;
}