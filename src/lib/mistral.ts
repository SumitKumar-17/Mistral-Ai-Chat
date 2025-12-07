import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

export const mistral = apiKey ? new Mistral({ apiKey }) : null;

export async function getMistralResponse(message: string, history: { role: 'user' | 'assistant', content: string }[] = []) {
    if (!mistral) {
        return "I'm sorry, I'm not configured correctly (missing API key).";
    }

    try {
        const chatResponse = await mistral.chat.complete({
            model: 'mistral-tiny',
            messages: [
                { role: 'system', content: 'You are a helpful and friendly AI assistant in a chat application. Keep your responses concise and conversational.' },
                ...history,
                { role: 'user', content: message }
            ]
        });

        return chatResponse.choices?.[0].message.content || "I'm not sure what to say.";
    } catch (error: any) {
        console.error('Mistral API error:', error);
        // Fallback for demo purposes since API key might be invalid
        return "I'm sorry, I couldn't reach the Mistral API (likely invalid API Key). I am a helpful AI assistant!";
    }
}
