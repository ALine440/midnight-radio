const TRACK_COUNT = 12;
const AUDIO_EXT = ".mp3";
const LYRIC_EXT = ".lrc";
const COVER_EXTS = [".jpg",".jpeg",".png",".webp"];

const titles = ["月光が少しルートを外れる", "ネオンの海で揺れた", "幻の街で", "Afterglow", "まだ青いままで", "Afterglow Hotel", "ビルのシルエット", "Analog Veins", "漂う夜の波", "夢の花魁", "夜の隙間に", "響く鼓動だけ連れて"];

const tracks = Array.from({length: TRACK_COUNT}, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    no:n,
    title:titles[i],
    side:i < 6 ? "A" : "B",
    audio:`audio/${n}${AUDIO_EXT}`,
    lyric:`Lyric/${n}${LYRIC_EXT}`,
    coverBase:`covers/${n}`,
    backgroundBase:`backgrounds/${n}`
  };
});

const audio = document.getElementById("audio");
const app = document.getElementById("app");
const enterScreen = document.getElementById("enterScreen");
const enterBtn = document.getElementById("enterBtn");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const sideBtn = document.getElementById("sideBtn");
const playlistBtn = document.getElementById("playlistBtn");
const playlistBtn2 = document.getElementById("playlistBtn2");
const lyricsBtn = document.getElementById("lyricsBtn");
const muteBtn = document.getElementById("muteBtn");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const overlayBackdrop = document.getElementById("overlayBackdrop");
const overlayTitle = document.getElementById("overlayTitle");
const closeOverlay = document.getElementById("closeOverlay");
const playlistView = document.getElementById("playlistView");
const lyricsView = document.getElementById("lyricsView");
const lyricsScroller = document.getElementById("lyricsScroller");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const coverBox = document.getElementById("coverBox");
const coverFallback = document.getElementById("coverFallback");
const trackNo = document.getElementById("trackNo");
const trackTitle = document.getElementById("trackTitle");
const sidePill = document.getElementById("sidePill");
const sideOverlay = document.getElementById("sideOverlay");
const bgImage = document.getElementById("bgImage");
const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");
const volumeIcon = document.getElementById("volumeIcon");

let currentIndex = 0;
let lyrics = [];
let lyricsLoadedFor = -1;
let muted = false;

function fmt(sec){
  if(!Number.isFinite(sec)) return "--:--";
  const s=Math.floor(sec);
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function tryImage(base, onSuccess, onFail, i=0){
  if(i>=COVER_EXTS.length){onFail();return;}
  const src=base+COVER_EXTS[i];
  const test=new Image();
  test.onload=()=>onSuccess(src);
  test.onerror=()=>tryImage(base,onSuccess,onFail,i+1);
  test.src=src;
}

function setBackground(track){
  // If you later add backgrounds/01.jpg etc., they will be preferred.
  tryImage(track.backgroundBase, src=>{
    bgImage.style.backgroundImage=`url("${src}")`;
    bgImage.style.opacity=".58";
  },()=>{
    tryImage(track.coverBase, src=>{
      bgImage.style.backgroundImage=`url("${src}")`;
      bgImage.style.opacity=".48";
    },()=>{
      bgImage.style.backgroundImage="none";
      bgImage.style.opacity=".2";
    });
  });
}

function renderCover(track){
  coverBox.style.backgroundImage="";
  coverFallback.textContent=track.no;
  coverFallback.style.display="block";
  tryImage(track.coverBase, src=>{
    coverBox.style.backgroundImage=`url("${src}")`;
    coverFallback.style.display="none";
  },()=>{});
}

function renderTrack(){
  const t=tracks[currentIndex];
  audio.src=t.audio;
  trackNo.textContent=`${t.no} / ${TRACK_COUNT}`;
  trackTitle.textContent=t.title;
  sidePill.textContent=`${t.side} SIDE`;
  sideOverlay.textContent=`SIDE ${t.side}`;
  progress.value=0;
  currentTime.textContent="00:00";
  duration.textContent="--:--";
  renderCover(t);
  setBackground(t);
  lyricsLoadedFor=-1;
  lyrics=[];
  renderPlaylist();
  loadLyrics();
}

async function loadLyrics(){
  const indexAtStart=currentIndex;
  const t=tracks[indexAtStart];
  lyricsScroller.innerHTML=`<div class="lyric-line near">Loading lyrics…</div>`;
  try{
    const res=await fetch(t.lyric,{cache:"no-store"});
    if(!res.ok) throw new Error("LRC not found");
    const text=await res.text();
    lyrics=parseLRC(text);
    lyricsLoadedFor=indexAtStart;
    renderLyrics();
  }catch{
    lyrics=[];
    lyricsLoadedFor=indexAtStart;
    lyricsScroller.innerHTML=`
      <div class="lyric-line near">LRC NOT FOUND</div>
      <div class="lyric-line">Please place ${t.no}.lrc in the Lyric folder.</div>
    `;
  }
}

function parseLRC(text){
  const out=[];
  for(const line of text.split(/\r?\n/)){
    const times=[...line.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
    const content=line.replace(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g,"").trim();
    for(const m of times){
      const frac=m[3] ? Number(`0.${m[3]}`) : 0;
      if(content) out.push({time:Number(m[1])*60+Number(m[2])+frac,text:content});
    }
  }
  return out.sort((a,b)=>a.time-b.time);
}

function renderLyrics(){
  if(!lyrics.length){
    lyricsScroller.innerHTML=`<div class="lyric-line near">NO TIMED LYRICS</div>`;
    return;
  }
  lyricsScroller.innerHTML=lyrics.map((l,i)=>
    `<button class="lyric-line" data-time="${l.time}" data-index="${i}">${escapeHtml(l.text)}</button>`
  ).join("");
  lyricsScroller.querySelectorAll(".lyric-line").forEach(el=>{
    el.addEventListener("click",()=>{
      audio.currentTime=Number(el.dataset.time);
      updateLyrics();
    });
  });
}

function updateLyrics(){
  if(lyricsLoadedFor!==currentIndex || !lyrics.length) return;
  const time=audio.currentTime;
  let active=-1;
  for(let i=0;i<lyrics.length;i++){
    if(lyrics[i].time<=time) active=i;
    else break;
  }
  const els=lyricsScroller.querySelectorAll(".lyric-line");
  els.forEach((el,i)=>{
    el.classList.toggle("active",i===active);
    el.classList.toggle("near",i===active-1 || i===active+1);
  });
  if(active>=0 && overlayTitle.textContent==="LYRICS" && !overlay.hidden){
    els[active]?.scrollIntoView({behavior:"smooth",block:"center"});
  }
}

function renderPlaylist(){
  playlistView.innerHTML=tracks.map((t,i)=>`
    <button class="playlist-item ${i===currentIndex?"active":""}" data-index="${i}">
      <span class="pl-no">${t.no}</span>
      <span class="pl-title">${escapeHtml(t.title)}</span>
      <span class="pl-side">${t.side} SIDE</span>
    </button>
  `).join("");
  playlistView.querySelectorAll(".playlist-item").forEach(btn=>{
    btn.addEventListener("click",()=>{
      currentIndex=Number(btn.dataset.index);
      renderTrack();
      playCurrent();
    });
  });
}

function playCurrent(){
  audio.play().then(()=>{
    app.classList.add("is-playing");
    playBtn.dataset.state="playing";
  }).catch(()=>{
    // Browser may require a direct user gesture; the user can press PLAY again.
  });
}

function openOverlay(type){
  overlay.hidden=false;
  if(type==="lyrics"){
    overlayTitle.textContent="LYRICS";
    playlistView.hidden=true;
    lyricsView.hidden=false;
    updateLyrics();
  }else{
    overlayTitle.textContent="PLAYLIST";
    playlistView.hidden=false;
    lyricsView.hidden=true;
    renderPlaylist();
  }
}

function close(){
  overlay.hidden=true;
}

enterBtn.addEventListener("click",()=>{
  enterScreen.hidden=true;
  app.hidden=false;
  renderTrack();
  audio.load();
});

playBtn.addEventListener("click",()=>{
  if(audio.paused) playCurrent();
  else audio.pause();
});

prevBtn.addEventListener("click",()=>{
  currentIndex=(currentIndex-1+TRACK_COUNT)%TRACK_COUNT;
  renderTrack();
  playCurrent();
});

nextBtn.addEventListener("click",()=>{
  currentIndex=(currentIndex+1)%TRACK_COUNT;
  renderTrack();
  playCurrent();
});

sideBtn.addEventListener("click",()=>{
  currentIndex=currentIndex<6?6:0;
  renderTrack();
  playCurrent();
});

audio.addEventListener("loadedmetadata",()=>duration.textContent=fmt(audio.duration));
audio.addEventListener("timeupdate",()=>{
  currentTime.textContent=fmt(audio.currentTime);
  if(audio.duration) progress.value=Math.round(audio.currentTime/audio.duration*1000);
  updateLyrics();
});
audio.addEventListener("play",()=>{
  app.classList.add("is-playing");
  playBtn.dataset.state="playing";
});
audio.addEventListener("pause",()=>{
  app.classList.remove("is-playing");
  playBtn.dataset.state="paused";
});
audio.addEventListener("ended",()=>{
  currentIndex=(currentIndex+1)%TRACK_COUNT;
  renderTrack();
  playCurrent();
});

progress.addEventListener("input",()=>{
  if(audio.duration) audio.currentTime=Number(progress.value)/1000*audio.duration;
});

volume.addEventListener("input",()=>{
  const v=Number(volume.value)/100;
  audio.volume=v;
  volumeValue.textContent=String(Math.round(v*100));
  if(v>0 && muted){
    muted=false;
    audio.muted=false;
    muteBtn.textContent="VOL";
  }
});

function toggleMute(){
  muted=!muted;
  audio.muted=muted;
  muteBtn.textContent=muted?"MUTE":"VOL";
  volumeIcon.textContent=muted?"×":"◖";
}
muteBtn.addEventListener("click",toggleMute);

playlistBtn.addEventListener("click",()=>openOverlay("playlist"));
playlistBtn2.addEventListener("click",()=>openOverlay("playlist"));
lyricsBtn.addEventListener("click",()=>openOverlay("lyrics"));
menuBtn.addEventListener("click",()=>openOverlay("playlist"));
closeOverlay.addEventListener("click",close);
overlayBackdrop.addEventListener("click",close);

audio.volume=.8;
