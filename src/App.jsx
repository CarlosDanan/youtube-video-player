import React, { useRef, useState } from "react";
import ReactPlayer from 'react-player'
import './App.css';
import ProgressBarNumbers from "./ProgressBarNumbers";

export default function App() {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [videoDuration, setVideoDuration] = useState(10);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [inputString, setInputString] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [divH1, setDivH1] = useState('');
  const [show, setShow] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const apiKey = 'AIzaSyCuZ9KpPcQs1Oq8ntiNadJdrFX61krPJFI';

  console.log(thumbnail)

  const handleSetVideoDuration = () => {
    const video = ref.current;
    setVideoDuration(video.getDuration());
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = youtubeVideoUrl.match(regExp);
    let videoId = (match && match[7].length == 11) ? match[7] : false;
    fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + apiKey)
      .then(res => res.json())
      .then(
        (result) => {
          setVideoTitle(result.items[0].snippet.title);
          setThumbnail(result.items[0].snippet.thumbnails.standard.url)
        }
      )
  }

  const handleProgress = (e) => {
    setPlayed(e.playedSeconds);
    if (e.playedSeconds >= videoDuration - 10) {
      setPlaying(false)
      setShow(true)
      setDivH1('End')
    }
    else {
      setDivH1('Pause')
    }
  }
  const handleProgressBarChange = (e) => {
    const video = ref.current;
    const fraction = (e.target.value / videoDuration);
    video.seekTo(fraction, 'fraction')
  }

  const handleSetInputString = (e) => {
    setInputString(e.target.value);
  }

  const handleSetYoutubeVideoUrl = () => {
    setYoutubeVideoUrl(inputString);
  }


  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


  const handlePlay = async event => {
    setPlaying(true);
    await delay(700)
    setShow(false);
  }

  const handlePause = () => {
    setPlaying(false);

    setShow(true);
  }


  return (

    <div className="container">
      <div>
        <div className='input-container' >
          <h4>YoutubeUrl</h4>
          <input className='url-input' type="text" onChange={handleSetInputString} value={inputString} />
          <button onClick={handleSetYoutubeVideoUrl}>Get Video</button>
        </div>
      </div>

      <div className="video-section">
        <h1>Title:{videoTitle}</h1>
        <div className="video-box">
          <div className="player-wrapper">
            {show && <div className="fill"><img src={thumbnail} width={500} height={300} /></div>}
            <ReactPlayer
              ref={ref}
              url={youtubeVideoUrl}
              volume={1}
              controls={false}
              className="react-player"
              onReady={handleSetVideoDuration}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 0,
                    controls: 0,
                    fs: 0,
                    rel: 0,
                    showinfo: 0
                  }
                }
              }}
              playing={playing}
              width={500}
              height={300}
              onProgress={handleProgress}
            />
          </div>
          <div className="video-controllers" >
            <ProgressBarNumbers seconds={played} />
            <input type='range' value={played} onChange={handleProgressBarChange} min={0} max={videoDuration - 10} />
            <ProgressBarNumbers seconds={videoDuration - 10} />
            <button onClick={handlePlay}><strong>Play</strong></button>
            <button onClick={handlePause}><strong>Pause</strong></button>
          </div>
        </div>
      </div>
    </div>
  );
}