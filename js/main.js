// get(sendtext);var textInp = document.getElementById("textInp");
var submitInp = document.getElementById("submitInp");
var voiceInp = document.getElementById("voiceInp");
var outbox = document.getElementById("outbox");
var readvolume = document.getElementById("readvolume");
var voiceSelect = document.getElementById("voiceSelect");
var audioplayer = document.getElementById("audioplayer");
var downloadAudio = document.getElementById("downloadAudio");
var speechValue = "Write first. আগে লিখুন।";

submitInp.onclick = function () {
  get(textInp.value);
};
voiceInp.onclick = function () {
  voiceInp.classList.add("active");
  recognition.start();
};
// enter button ===========
document.addEventListener("keydown", function (event) {
  var tIL = textInp.value;
  if (event.keyCode === 13 && tIL.length > 1) {
    get(tIL);
  }
//    else {
//     textInp.focus();
//   }
  if (event.keyCode === 9) {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      read(speechValue);
    }
  }
});

// voice recognition =====
var recognition = new webkitSpeechRecognition();
recognition.onresult = function (result) {
  text = event.results[0][0].transcript;
  textInp.value = text;
  get(text);
};
recognition.onspeechend = function () {
  voiceInp.classList.remove("active");
};

// speech ==========
//   https://translate.google.com/translate_tts?ie=UTF-8&tl=en-us&client=tw-ob&q=raihan

function read(stext) {
  const utterance = new SpeechSynthesisUtterance(stext);
  utterance.lang = "bn-bd";
  speechSynthesis.speak(utterance);
}
readvolume.onclick = function () {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  } else {
    read(speechValue);
  }
};

// chat gpt function ============
function get(sendtext) {
  outbox.innerHTML = "Writing.........";
  readvolume.style.display = "none";

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: sendtext,
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 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",
    },
  })
    .then((res) => {
      if (!res.ok) {
        const message = `Error : ${res.status}`;
        throw new Error(message);
      }
      return res.json();
    })
    .then((res) => {
      outputs = res["choices"][0]["text"];
      out1 = outputs.replace(/\n\n/g, " ");
      out = out1.replace(/\n/g, "<br>");

      outbox.innerHTML = out;
      speechValue = outputs;
      readvolume.style.display = "block ";
    })
    .catch(function (error) {
      console.log(error);
      alert("Network Error, Try Again!!");
    });
}



// download audio
downloadAudio.addEventListener("click",function () {
    audiovalue=outbox.innerText;
    var urltts =   `https://translate.google.com/translate_tts?ie=UTF-8&tl=${voiceSelect.value}&client=tw-ob&q=${audiovalue}`;
  audioplayer.src=urltts;
});
