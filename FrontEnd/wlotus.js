//TENSORFLOW MODEL
const model = await tf.loadLayersModel('tsjson/sejalmodelJS/model.json');
let clsval;
let x=1;
let t=10;
let cntx=0;

//WEBCAM
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Get access to the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  });

// Draw the video frame onto the canvas every 16ms
setInterval(async () => {
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if(x==1)
    {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const img = tf.browser.fromPixels(imgData);
        const resizedImg = tf.image.resizeBilinear(img, [256, 256]);
        const normalizedImg = resizedImg.div(tf.scalar(255));
        const batchedImg = normalizedImg.expandDims(0);
        const predictions = await model.predict(batchedImg);
        const topPrediction = predictions.argMax(1);
        console.log('Predicted class:', topPrediction.dataSync()[0]);
        clsval = topPrediction.dataSync()[0];
        
        if(clsval==2)
        {
            if(cntx<10)
            {
                cntx=cntx+1;
            }
            if(cntx==10)
            {
                t=t-1;
                document.getElementById('countdown').innerHTML = t;
                cntx=0;
            }
            if(t==0)
            {
                x=0;
                document.getElementById('countdown').innerHTML = '<h2>Click Next!</h2>';
            }
        }
        else
        {
            t=10;
            document.getElementById('countdown').innerHTML = t;
        }
    }
    
}, 100);