document.getElementById('sendChatBtn').addEventListener('click', function() {
    const userInput = document.getElementById('chatInput').value.trim();
    const storyOutput = document.getElementById('chatbox');
    const solveMysteryMode = document.getElementById('toggleSolveMysteryBtn').textContent.includes('Don\'t');
    storyOutput.innerHTML = '';

    if (!userInput) return;

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'spinner';
    storyOutput.appendChild(loadingIndicator);

    const API_KEY = "OpenAI API KEY HERE"; //I REMOVED THE API KEY FOR THE GITHUB VERSION
    const API_URL = "https://api.openai.com/v1/chat/completions";

    // Adjust the prompt to mimic the style of Two-Minute Mysteries
    const prompt = solveMysteryMode
        ? `Based on the prompt: "${userInput}", generate a detailed murder mystery story similar to those in the book Two-Minute Mysteries. The story should provide a detective solving a case, with enough clues for readers to deduce how the detective solved the case. Make the story longer than typical by adding more descriptions and clues, and end with a clear outcome that does not explicitly reveal the detective's method. Include a solution separately, prefaced by "Solution:", so that it can be shown afterward in an "Answer" section.`
        : `Based on the prompt: "${userInput}", generate a detailed murder mystery story with a clear conclusion. Make the story longer than usual by adding extra descriptive details and clues.`;


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
                content: prompt
            }],
        })
    };

    fetch(API_URL, requestOptions)
        .then(response => response.json())
        .then(data => {
            const text = data.choices[0].message.content.trim();
            const firstBreakIndex = text.indexOf("\n");
            const title = text.substring(0, firstBreakIndex).trim();
            let story = text.substring(firstBreakIndex + 1).trim();
            let solutionIndex = story.indexOf("Solution:");
            let solution = '';

            // If a solution is present in the response, separate it from the main story
            if (solutionIndex !== -1) {
                solution = story.substring(solutionIndex + "Solution:".length).trim();
                story = story.substring(0, solutionIndex).trim(); // Keep only the story without the solution
            }

            const formattedText = `<h2>${title}</h2><p>${story.replace(/(?<!\b(Dr|Mr|Mrs|Ms))\.(\s+)(?=[A-Z])/g, ".</p><p>")}</p>`;

            if (solveMysteryMode) {
                // Create an answer box with the solution provided
                const answerBox = document.createElement('details');
                answerBox.innerHTML = `<summary>Answer</summary><p>${solution}</p>`;
                storyOutput.innerHTML = formattedText;
                storyOutput.appendChild(answerBox);
            } else {
                storyOutput.innerHTML = formattedText;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error generating the story. Please try again.';
            storyOutput.appendChild(errorMessage);
        })
        .finally(() => {
            storyOutput.removeChild(loadingIndicator);
        });
});

document.getElementById('toggleSolveMysteryBtn').addEventListener('click', function() {
    const toggleBtn = document.getElementById('toggleSolveMysteryBtn');
    const isCurrentlySolving = toggleBtn.textContent.includes('Don\'t');

    toggleBtn.textContent = isCurrentlySolving ? 'Want to solve the mystery yourself?' : 'Don\'t want to solve the mystery yourself?';

    document.getElementById('solveRevealed').style.display = isCurrentlySolving ? 'block' : 'none';
    document.getElementById('solveNotRevealed').style.display = isCurrentlySolving ? 'none' : 'block';
});

document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('sendChatBtn').click();
    }
});
