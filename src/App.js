import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import domtoimage from "dom-to-image";
import "./App.css";

function App() {
  const [memeData, setMemeData] = useState();
  const [memeURL, setMemeURL] = useState();
  const [memeText, setMemeText] = useState();
  const [userImageUrl, setUserImageUrl] = useState();
  const imageContainerRef = useRef();
  const topInputRef = useRef(null);
  const botInputRef = useRef(null); //TODO: re-launch server once with 'npm start' for new useRef hooks

  // console.log("Random 0-4 = " + Math.floor(Math.random() * 5));
  // console.log("Random 0-4 = " + Math.floor(Math.random() * 5));
  // console.log("Random 0-4 = " + Math.floor(Math.random() * 5));
  // console.log("Random 0-4 = " + Math.floor(Math.random() * 5));
  // console.log("Random 0-4 = " + Math.floor(Math.random() * 5));
  // console.log("Random 0-4 = " + Math.floor(Math.random() * 5));
  //random number generation
  //random(0 to n) = Math.floor(Math.random()*(n+1))

  useEffect(() => {
    axios
      .get("https://api.imgflip.com/get_memes")
      .then(function (response) {
        // handle success
        const memeData = response.data.data.memes;
        console.log(memeData);
        setMemeData(memeData);
        console.log(getRandomMeme(memeData));
        setMemeURL(getRandomMeme(memeData).url);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const handleResetUserInput = () => {
    setMemeText({
      top: "",
      bottom: "",
    });
    topInputRef.current.value = "";
    botInputRef.current.value = "";
  };

  const getRandomMeme = (memes) =>
    memes[Math.floor(Math.random() * memes.length)];

  const handleClick = () => {
    setUserImageUrl();
    setMemeURL(getRandomMeme(memeData).url);
  };

  //setSomeState(
  //  {firstProperty: someNewValue
  //  secondProperty: someState.secondProperty})
  //setSomeState(
  //  {firstProperty: someState.firstProperty
  //  secondProperty: someNewValue})

  const handleInputTop = (e) => {
    console.log(e.currentTarget.value);
    let bottomText = "";
    if (memeText) {
      if (memeText.bottom) {
        bottomText = memeText.bottom;
      }
    }
    try {
      setMemeText({
        top: e.currentTarget.value,
        bottom: bottomText,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputBottom = (e) => {
    console.log(e.currentTarget.value);
    let topText = "";
    if (memeText) {
      if (memeText.top) {
        topText = memeText.top;
      }
    }
    try {
      setMemeText({
        top: topText,
        bottom: e.currentTarget.value,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getMemeTop = () => {
    return memeText ? (memeText.top ? memeText.top : "") : "";
    //return "";
  };

  const getMemeBottom = () => {
    return memeText ? (memeText.bottom ? memeText.bottom : "") : "";
  };

  const handleOnChange = (e) => {
    setUserImageUrl(URL.createObjectURL(e.target.files[0]));
    e.target.value = "";
    // const objectURL = URL.createObjectURL(userImageUrl);
  };

  const generateImage = () => {
    // console.log(imageContainerRef.current);
    domtoimage
      .toJpeg(imageContainerRef.current, { quality: 0.95 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-new-meme.jpeg";
        link.href = dataUrl;
        link.click();
      });
  };

  return (
    <div className="App">
      <h1>Memefy!</h1>
      <h4>A React based Meme Generator</h4>
      <div>
        <input
          ref={topInputRef}
          className="userInput"
          onChange={handleInputTop}
          type="text"
          placeholder="Text on top..."
        />
        <input
          ref={botInputRef}
          className="userInput"
          onChange={handleInputBottom}
          type="text"
          placeholder="Text on bottom..."
        />

        <button onClick={generateImage}>Generate</button>
        <button onClick={handleResetUserInput}>Reset</button>

        <input type="file" id="input" onChange={handleOnChange} />
      </div>
      <div>
        <button>Prev</button>
        <button onClick={handleClick}>Random</button>
      </div>
      {memeURL && (
        <div className="captionContainer" id="my-node" ref={imageContainerRef}>
          <p className="topText captionText">{getMemeTop()}</p>
          <p className="bottomText captionText">{getMemeBottom()}</p>
          <img
            className="meme-img"
            src={userImageUrl ? userImageUrl : memeURL}
            alt="I don't have memes."
          />
        </div>
      )}
    </div>
  );
}

export default App;
