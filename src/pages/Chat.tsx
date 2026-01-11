import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Send, User, Bot, Loader2 } from 'lucide-react';

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
    const location = useLocation();
    const navigate = useNavigate();

    const sessionId = location.state?.sessionId || localStorage.getItem("sessionId");

    useEffect(() => {
        if (!sessionId) {
            navigate("/");
        }
    }, [sessionId, navigate]);

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
            // TODO: Implement API call
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
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

    return (
        <div className="flex flex-col h-screen bg-amber-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-display font-semibold text-stone-800">J*b Hunt</h1>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-2xl rounded-lg px-4 py-3 text-stone-800 ${message.role === 'user'
                                        ? 'border border-gray-200 bg-white'
                                        : ''
                                    }`}
                            >
                                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            </div>

                            {message.role === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-amber-50 border-t border-gray-200 px-4 py-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3 items-end">
                        <textarea
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            rows={1}
                            className="flex-1 resize-none rounded-lg border bg-white border-gray-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-300 focus:border-transparent"
                            style={{ maxHeight: '120px' }}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!input.trim() || isLoading}
                            className="flex-shrink-0 bg-stone-800 text-white rounded-lg px-4 py-3 hover:bg-stone-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Chat;