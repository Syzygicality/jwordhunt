import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant'; // ? change for backend
    content: string;
}

interface APIMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ContentBlock {
    type: string;
    text?: string;
}

interface APIResponse {
    content: ContentBlock[];
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'What\'s on your mind today?' }
    ]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (): Promise<void> => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch();

            const data: APIResponse = await response.json();
            const assistantMessage = data.content
                .map(item => (item.type === 'text' ? item.text : ''))
                .filter(Boolean)
                .join('\n');

            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: assistantMessage },
            ]);

        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, an error occurred. Please try again.'
            }])
        } finally {
            setIsLoading(false);
        }
    };
}


export default Chat;