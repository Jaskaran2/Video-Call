const socket=io('/');

const videoGrid=document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;

var peer =new Peer(undefined,{
  path:'/peerjs',
  host:'/',
  port:'3000'
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio:true
}).then(stream=>{
  myVideoStream=stream;
  addVideoStream(myVideo, stream);

  peer.on('call',call=>{
    call.answer(stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
      addVideoStream(video,userVideoStream)
    });
  });

  socket.on('user-connected',(userId)=>{
    connecToNewUser(userId,stream);
  });


  let text=$('input');


  $('html').keydown((e)=>{
    if(e.which==13&& text.val().length!==0){
      socket.emit('message',text.val());
      text.val('')
    }
  });

  socket.on('createMessage',message=>{
    console.log(message);
      $('#messages').append(`<li id="message"><b>Guests</b><br />${message}</li>`)
      scrollToBottom();
  });

});


peer.on('open',id =>{
  socket.emit('join-room',ROOM_ID,id);
});



function connecToNewUser(userId,stream){
    console.log("This is the user id: "+userId);
  const call= peer.call(userId,stream)
  const video=document.createElement('video')
  call.on('stream',userVideoStream=>{
    addVideoStream(video,userVideoStream);
  })
}



function addVideoStream(video,stream){
  video.srcObject=stream;
  video.addEventListener('loadedmetadata',()=>{
    video.play();
  })
  videoGrid.append(video);
}

const scrollToBottom=()=>{
  let d=$('.main__chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}

//Mute video
const muteUnmute=()=>{
  const enabled=myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled=false;
    setUnmuteButton();
  }
  else{
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled=true;
  }
}

const setMuteButton=()=>{
  const html=`
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
  `

  document.querySelector('.main__mute__button').innerHTML=html;
}

const setUnmuteButton=()=>{
  const html=`
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
  `

  document.querySelector('.main__mute__button').innerHTML=html;
}

//Stop and play video

const playStop=()=>{
  const enabled=myVideoStream.getVideoTracks()[0].enabled;
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled=false;
    setPlayVideo();
  }
  else{
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled=true;
  }
}

const setStopVideo=()=>{
  const html=`
  <i class="fas fa-video"></i>
  <span>Stop video</span>
  `

  document.querySelector('.main__video__button').innerHTML=html;
}

const setPlayVideo=()=>{
  const html=`
  <i class="unmute fas fa-video-slash"></i>
  <span>Play Video</span>
  `

  document.querySelector('.main__video__button').innerHTML=html;
}
