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

  const handleTextChange = (index, text) => {
    const updatedText = [...comicText];
    updatedText[index] = text;
    setComicText(updatedText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="comic-generator">
      <h1>Comic Strip Generator</h1>
      <form onSubmit={handleSubmit}>
        {comicText.map((text, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Panel ${index + 1} text`}
            value={text}
            onChange={(e) => handleTextChange(index, e.target.value)}
          />
        ))}
        <button type="submit">Generate Comic</button>
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
