// status fields and start button in UI
    
    
          
  //var startSpeakTextAsyncButton;
  //startSpeakTextAsyncButton = document.getElementById("startSpeakTextAsyncButton");
  //resultDiv = document.getElementById("resultDiv");
  var subscriptionKey, serviceRegion;
  //var SpeechSDK;
  var synthesizer;
  subscriptionKey = 'a3282cc7c1ba4df99986fe73c2ad5fb6';
  serviceRegion = 'eastus';
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  speechConfig.speechSynthesisLanguage = "ta-IN"; 
  speechConfig.speechSynthesisVoiceName = "ta-IN-ValluvarNeural";
  var player = new SpeechSDK.SpeakerAudioDestination();
  var audioConfig  = SpeechSDK.AudioConfig.fromSpeakerOutput(player);
  console.log('player',player);
  
  $(document).on("click",'.speechFunction',function () {
    //console.log(localStorage.getItem('articleDetails'));
    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig,audioConfig);
    var articleDetails = localStorage.getItem('articleDetails');
    var phraseDiv;
    var phraseHeader;
    var obj;
    var resultDiv;
    var inputText;
    // subscription key and region for speech services.
    obj = JSON.parse(articleDetails);
    phraseDiv = obj.content;
    phraseHeader = obj.a_title;
        
    if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
      alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
      return;
    }
    var htmlContent = phraseDiv.replace(/<center.*?>.*?<\/center>/ig,'').replace(/<\/?[^>]+(>|$)/g, "").replace(/&quot;/g,'"').replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"').replace(/&lsquo;/g,'"').replace(/&rsquo;/g,'"').replace(/&#39;/g,'').replace(/&zwnj;/g,'');
    inputText = phraseHeader+'.   '+htmlContent;
    console.log(phraseHeader+'.  '+htmlContent);
    $('.playButton').removeClass('speechFunction');
    $('.playButton').find('.fa').removeClass('fa-play').addClass('fa-pause');
    $('.playButton').addClass('pauseFunction');
    synthesizer.speakTextAsync(
      inputText,
      function (result) {
        console.log(result);
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log('completed');
        } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
          console.log('error');
        }
        synthesizer.close();
        synthesizer = undefined;
      },
      function (err) {
        resultDiv.innerHTML += "Error: ";
        resultDiv.innerHTML += err;
        resultDiv.innerHTML += "\n";
        console.log(err);

        synthesizer.close();
        synthesizer = undefined;
    });
  });
  $(document).on('click','.pauseFunction',function(){ 
    player.pause();
    $('.playButton').removeClass('pauseFunction');
    $('.playButton').find('.fa').removeClass('fa-pause').addClass('fa-play');
    $('.playButton').addClass('resumeFunction');
  });
  $(document).on('click','.resumeFunction',function(){ 
    player.resume();
    $('.playButton').removeClass('resumeFunction');
    $('.playButton').find('.fa').removeClass('fa-play').addClass('fa-pause');
    $('.playButton').addClass('pauseFunction');
  });

  function closeBuffer(){
    player.pause();
    $('.playButton').removeClass('resumeFunction');
    $('.playButton').removeClass('pauseFunction');
    $('.playButton').find('.fa').removeClass('fa-pause').addClass('fa-play');
    $('.playButton').addClass('speechFunction');
    player.privIsClosed = false;
    player.privIsPaused = false;
    player.privMediaSourceOpened = false;
    player.privPlaybackStarted = false;
    player.privMediaSource = {'duration':1800};
    console.log('closeBuffer',player);
  }
    
    
  
  // if (!!window.SpeechSDK) {
  //   SpeechSDK = window.SpeechSDK;
  //   startSpeakTextAsyncButton.disabled = false;

  //   document.getElementById('content').style.display = 'block';
  //   document.getElementById('warning').style.display = 'none';

  //   // in case we have a function for getting an authorization token, call it.
  //   if (typeof RequestAuthorizationToken === "function") {
  //       RequestAuthorizationToken();
  //   }
  // }
    