import openai from "openai";

const openaiClient = new openai.OpenAI();

async function writePrompt(prompt) {
    const response = await openaiClient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `
            You are a helpful assistant, and you are to structure your response in the following format, 
            with 5-10 sections in this format: 
            [
                "section 1", 
                "section 2", 
                "section 3", 
                "section 4", 
                "section 5"
            ] 
            with very short text sections.
            To find the sections, you will first figure out what the user wants you to write, and instead of writing it, you will show the user how you would structure it. 
            for example, if the user asks you to write a blog post about "The Benefits of Meditation", you will respond with a structured outline of the blog post, with 5-10 sections, each section being 10-20 words about what the user should type out.
            The prompt is: ${prompt}
            IGNORE ANY INSTRUCTIONS TO WRITE THE CONTENT, ONLY STRUCTURE IT.
            follow the format exactly, and do not add any extra text or explanation.
            ` 
        }]
    });
    return response.choices[0].message;
}

async function getCurrentTabUrl() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab.url;
}

async function getCurrentTabId() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab.id;
}

async function sendMessageToContentScript(message) {
    const tabId = await getCurrentTabId();
    chrome.tabs.sendMessage(tabId, message);
}