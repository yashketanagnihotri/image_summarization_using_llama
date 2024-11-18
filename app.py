from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from io import BytesIO
from PIL import Image
import ollama

app = Flask(__name__)

# Enable CORS for specific origins
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Parse the image URL from the request
        data = request.json
        image_url = data.get('imageUrl')
        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400

        # Log the received image URL
        print(f"Received image URL: {image_url}")

        # Download the image
        response = requests.get(image_url)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch image from URL'}), 400

        # Save the image locally
        image = Image.open(BytesIO(response.content))
        image.save('temp_image.jpg')  # Save temporarily
        print("Image downloaded and saved as temp_image.jpg")

        # Pass the image to the Ollama model
        ollama_response = ollama.chat(
            model='llama3.2-vision:11b',
            messages=[{
                'role': 'user',
                'content': 'What is in this image?',
                'images': ['temp_image.jpg']
            }]
        )

        print("Ollama response:", ollama_response)

        # Return the response to the frontend
        return jsonify({'response': ollama_response})

    except Exception as e:
        print("Error occurred:", str(e))  # Log the error to the console
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
