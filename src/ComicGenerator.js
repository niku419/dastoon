import React, { useState } from 'react';

async function query(data) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        "Accept": "image/png",
        "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  console.log(result)
  return result;
}

function ComicGenerator() {
  const [comicText, setComicText] = useState(['eren', 'mikasa', 'titan', 'armin', 'levi', 'annie', 'jean', 'aot', 'colossal', 'rumbling']);
  const [comicImages, setComicImages] = useState(Array(10).fill(null));
  const [buttonDisable, setButtonDisable] = useState(false);

  const handleTextChange = (index, text) => {
    const updatedText = [...comicText];
    updatedText[index] = text;
    setComicText(updatedText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisable(true)
    const imagePromises = comicText.map((text) => {
      return query({ "inputs": text });
    });

    try {
      const imageResponses = await Promise.all(imagePromises);
      const imageUrls = imageResponses.map(response => URL.createObjectURL(response));
      console.log(imageUrls)
      setComicImages(imageUrls);
    } catch (error) {
      console.error('API Error:', error);
      // Handle API errors and provide user feedback
    } finally {
      setButtonDisable(false);
    }
  };

  return (
    <div className="comic-generator">
      <div className='flex-center'><h1 className='comic-title'>Comic Strip Generator</h1></div>
      <form onSubmit={handleSubmit} className="comic-form">
        {comicText.map((text, index) => (
          <div key={index} className="panel-input">
            <label htmlFor={`panel-${index + 1}`} className="panel-label">{`Panel ${index + 1}`}</label>
            <input
              id={`panel-${index + 1}`}
              type="text"
              placeholder={`Enter text for Panel ${index + 1}`}
              value={text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              className="panel-text-input"
            />
          </div>
        ))}
        <button type="submit" className="generate-button" disabled={buttonDisable}>
          {buttonDisable ? 'Generating...' : 'Generate Comic'}
        </button>
      </form>
      <article className="comic">
        {comicImages.map((imageUrl, index) => (
          <img className="panel" style={{ objectFit: "cover" }} src={imageUrl} alt={`Panel ${index + 1}`} />
        ))}
      </article>
    </div>
  );
}

export default ComicGenerator;
