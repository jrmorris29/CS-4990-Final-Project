document.getElementById('sendChatBtn').addEventListener('click', function() {
    const userInput = document.getElementById('chatInput').value.trim();
    const storyOutput = document.getElementById('chatbox');

    if (!userInput) return;  // Check if the userInput is not empty

    // Clear the chatbox before displaying new content
    storyOutput.innerHTML = '';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'spinner';
    storyOutput.appendChild(loadingIndicator);

    const API_KEY = "sk-proj-IJo4bEN1ZD1XDyqhIpc1T3BlbkFJsR15glqTeYWFBVxvY8ND"; // Replace this with your actual API key
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "Generate a murder mystery story with a title."
            }, {
                role: "user",
                content: `Based on the prompt: "${userInput}", generate a murder mystery story. Start with a title and then proceed with the story. Be sure to include a clear conclusion of the mystery.`
            }],
        })
    };

    fetch(API_URL, requestOptions)
        .then(response => response.json())
        .then(data => {
            const text = data.choices[0].message.content.trim();
            // Splitting text to separate the title and the story
            const firstBreakIndex = text.indexOf("\n"); // Find the first newline, assuming title is separated by a newline
            const title = text.substring(0, firstBreakIndex).trim();
            const story = text.substring(firstBreakIndex + 1).trim();

            const formattedText = `<h2>${title}</h2><p>${story.replace(/(?<!\b(Dr|Mr|Mrs|Ms))\.(\s+)(?=[A-Z])/g, ".</p><p>")}</p>`;
            storyOutput.innerHTML = formattedText; // Display the formatted text with title and paragraphs
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error generating the story. Please try again.';
            storyOutput.appendChild(errorMessage);
        })
        .finally(() => {
            storyOutput.removeChild(loadingIndicator);
            // Removed auto-scroll to the bottom
        });
});

document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('sendChatBtn').click();
    }
});
