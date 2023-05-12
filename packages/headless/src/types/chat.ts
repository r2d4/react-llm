export interface Conversation {
    id: string;
    title: string;
    systemPrompt: string;
    createdAt: number;
    updatedAt: number;
    messages: Message[];
}

export interface Message {
    id: string;
    role: string;
    text: string;
    createdAt: number;
    updatedAt: number;
}