let currentSong=new Audio;
let songs;
let currfolder;
function convertToMMSS(seconds) {
    // Ensure the input is a number
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds as two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
        // Fetch the data
        currfolder=folder;
        let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                let new_element=element.href.split(`/${folder}/`)[1];
                songs.push(new_element)
            }
        }
        
        let songul = document.querySelector(".songList").getElementsByTagName("ul")[0];
        songul.innerHTML="";
        for (const song of songs) {
            songul.innerHTML = songul.innerHTML + `
        <li>
            <img class="invert music" src="image/music.svg" alt="">
            <div class="songinfo">
                <div class="songname">${song.replaceAll("%20", " ")}</div>
                <div>Yugam</div>
            </div>
            <div class="playnow">
                <span>play now</span>
                <img class="invert" src="image/play.svg" alt="">
            </div>
        </li>`;
        }

        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
            e.addEventListener("click",element=>{
                PlayMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim());
            })

        })
        return songs;
} 

const PlayMusic=(track , pause=false)=>{
    currentSong.src=`/${currfolder}/`+track
    if(!pause){
        currentSong.play()
        play.src="image/pause.svg"
    }
    document.querySelector(".songinfoplaybar").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
} 

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a");
    let cardContainer=document.querySelector(".cardContainer");
    let array=Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs")){
            let folder=e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="image/play.svg" alt="play">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    };
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`);  
            PlayMusic(songs[0]);
        })
    });
}

async function main() {
    await getSongs("songs/angry");
    PlayMusic(songs[0],true)
    
    displayAlbums()

    play.addEventListener("click",element=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="image/pause.svg";
        }
        else{
            currentSong.pause();
            play.src="image/play.svg";
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${convertToMMSS(currentSong.currentTime)}/${convertToMMSS(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%"; 
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
         let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
         document.querySelector(".circle").style.left=percent+"%";
         currentSong.currentTime=((currentSong.duration)*percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click",e=>{
        document.querySelector(".left").style.left="0"
    })    
    document.querySelector(".close").addEventListener("click",e=>{
        document.querySelector(".left").style.left="-120%"
    })  

    prev.addEventListener("click",e=>{
        currentSong.pause();
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index-1>=0){
            PlayMusic(songs[index-1]);
        }
        else{
            PlayMusic(songs[index]);
        }
    })  
    next.addEventListener("click",e=>{
        currentSong.pause();
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index+1<songs.length){
            PlayMusic(songs[index+1]);
        }
        else{
            PlayMusic(songs[index]);
        }
    }) 
    var org_val 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume=parseInt(e.target.value)/100
        let a=document.querySelector(".range").getElementsByTagName("input")[0];
        org_val=a.value;
    })
    document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click",(e)=>{
        let a=document.querySelector(".range").getElementsByTagName("input")[0];
        let vol_img=document.querySelector(".volume").getElementsByTagName("img")[0]
        if(a.value!=0){
            vol_img.src="image/mute.svg";
            a.value='0';
        }
        else if(a.value==0){
            a.value=org_val;
            vol_img.src="image/volume.svg";
        }
        currentSong.volume=parseInt(a.value)/100;
    })
    
    
}
main()