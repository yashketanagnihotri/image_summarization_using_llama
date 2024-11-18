import { useState } from 'react';
import './App.css';

function App() {
  const [url, setURL] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(''); // New state for image URL

  const submitImage = async () => {
    try {
      setError(null);
      setResponseMessage('Processing...');
  
      const response = await fetch('http://127.0.0.1:5000/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
  
      const data = await response.json();
      setResponseMessage(data.response);
    } catch (err) {
      setError(err.message);
      setResponseMessage('');
    }
  };

  const handleURLChange = (e) => {
    setURL(e.target.value);
    setImageSrc(e.target.value); // Update image source as the URL is entered
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20 gap-4">
      <h1 className="text-2xl font-bold">Image Summarizer Tool</h1>

      {/* Image URL input */}
      <input
        type="text"
        value={url}
        onChange={handleURLChange}
        className="border border-black p-2 w-96 rounded"
        placeholder="Enter image URL"
      />

      {/* Image Display */}
      {imageSrc && (
        <div className="mt-4">
          <img 
            src={imageSrc} 
            alt="Image preview" 
            className="w-[200px] h-auto rounded shadow" // Resize image to 200px width
          />
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={submitImage}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4"
      >
        Submit
      </button>

      {/* Display response */}
      <div>
      {responseMessage && (
        <div className="mt-4 bg-green-100 p-4 rounded shadow mx-24">
          <h2 className="font-bold">Response:</h2>
          <p>{responseMessage !== 'Processing...' ? responseMessage.message.content : responseMessage}</p>
        </div>
      )}
      </div>
      

      {/* Display error */}
      <div>
      {error && (
        <div className="mt-4 bg-red-100 p-4 rounded shadow">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
