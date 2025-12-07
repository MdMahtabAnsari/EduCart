// 'use client';
// import {
//     Conversation,
//     ConversationContent,
//     ConversationScrollButton,
// } from '@/components/ai-elements/conversation';
// import {
//     Message,
//     MessageContent,
//     MessageResponse,
//     MessageActions,
//     MessageAction,
// } from '@/components/ai-elements/message';
// import {
//     PromptInput,
//     PromptInputActionAddAttachments,
//     PromptInputActionMenu,
//     PromptInputActionMenuContent,
//     PromptInputActionMenuTrigger,
//     PromptInputAttachment,
//     PromptInputAttachments,
//     PromptInputBody,
//     PromptInputButton,
//     PromptInputHeader,
//     type PromptInputMessage,
//     PromptInputSelect,
//     PromptInputSelectContent,
//     PromptInputSelectItem,
//     PromptInputSelectTrigger,
//     PromptInputSelectValue,
//     PromptInputSubmit,
//     PromptInputTextarea,
//     PromptInputFooter,
//     PromptInputTools,
// } from '@/components/ai-elements/prompt-input';
// import { useState } from 'react';
// import { useChat } from '@ai-sdk/react';
// import { CopyIcon, GlobeIcon, Loader, RefreshCcwIcon } from 'lucide-react';
// import {
//     Source,
//     Sources,
//     SourcesContent,
//     SourcesTrigger,
// } from '@/components/ai-elements/sources';
// import {
//     Reasoning,
//     ReasoningContent,
//     ReasoningTrigger,
// } from '@/components/ai-elements/reasoning';
// import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

// const models = [
//     { name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
//     { name: 'Gemini 1.5 Flash (Latest)', value: 'gemini-1.5-flash-latest' },
//     { name: 'Gemini 1.5 Flash 001', value: 'gemini-1.5-flash-001' },
//     { name: 'Gemini 1.5 Flash 002', value: 'gemini-1.5-flash-002' },

//     { name: 'Gemini 1.5 Flash 8B', value: 'gemini-1.5-flash-8b' },
//     { name: 'Gemini 1.5 Flash 8B (Latest)', value: 'gemini-1.5-flash-8b-latest' },
//     { name: 'Gemini 1.5 Flash 8B 001', value: 'gemini-1.5-flash-8b-001' },

//     { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
//     { name: 'Gemini 1.5 Pro (Latest)', value: 'gemini-1.5-pro-latest' },
//     { name: 'Gemini 1.5 Pro 001', value: 'gemini-1.5-pro-001' },
//     { name: 'Gemini 1.5 Pro 002', value: 'gemini-1.5-pro-002' },

//     { name: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
//     { name: 'Gemini 2.0 Flash 001', value: 'gemini-2.0-flash-001' },
//     { name: 'Gemini 2.0 Flash Live 001', value: 'gemini-2.0-flash-live-001' },
//     { name: 'Gemini 2.0 Flash Lite', value: 'gemini-2.0-flash-lite' },

//     { name: 'Gemini 2.0 Pro Experimental (02-05)', value: 'gemini-2.0-pro-exp-02-05' },
//     { name: 'Gemini 2.0 Flash Thinking Experimental (01-21)', value: 'gemini-2.0-flash-thinking-exp-01-21' },
//     { name: 'Gemini 2.0 Flash Experimental', value: 'gemini-2.0-flash-exp' },

//     { name: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
//     { name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
//     { name: 'Gemini 2.5 Flash Image Preview', value: 'gemini-2.5-flash-image-preview' },
//     { name: 'Gemini 2.5 Flash Lite', value: 'gemini-2.5-flash-lite' },
//     { name: 'Gemini 2.5 Flash Lite Preview (09-2025)', value: 'gemini-2.5-flash-lite-preview-09-2025' },
//     { name: 'Gemini 2.5 Flash Preview (04-17)', value: 'gemini-2.5-flash-preview-04-17' },
//     { name: 'Gemini 2.5 Flash Preview (09-2025)', value: 'gemini-2.5-flash-preview-09-2025' },

//     { name: 'Gemini 3 Pro Preview', value: 'gemini-3-pro-preview' },
//     { name: 'Gemini 3 Pro Image Preview', value: 'gemini-3-pro-image-preview' },

//     { name: 'Gemini Pro Latest', value: 'gemini-pro-latest' },
//     { name: 'Gemini Flash Latest', value: 'gemini-flash-latest' },
//     { name: 'Gemini Flash Lite Latest', value: 'gemini-flash-lite-latest' },

//     { name: 'Gemini 2.5 Pro Experimental (03-25)', value: 'gemini-2.5-pro-exp-03-25' },
//     { name: 'Gemini Experimental 1206', value: 'gemini-exp-1206' },

//     { name: 'Gemma 3 12B IT', value: 'gemma-3-12b-it' },
//     { name: 'Gemma 3 27B IT', value: 'gemma-3-27b-it' },
// ];

// export const Chat = () => {
//     const [input, setInput] = useState('');
//     const [model, setModel] = useState<string>(models[0].value);
//     const [webSearch, setWebSearch] = useState(false);
//     const { messages, sendMessage, status, regenerate } = useChat();
//     const handleSubmit = (message: PromptInputMessage) => {
//         const hasText = Boolean(message.text);
//         const hasAttachments = Boolean(message.files?.length);
//         if (!(hasText || hasAttachments)) {
//             return;
//         }
//         sendMessage(
//             {
//                 text: message.text || 'Sent with attachments',
//                 files: message.files
//             },
//             {
//                 body: {
//                     model: model,
//                     webSearch: webSearch,
//                 },
//             },
//         );
//         setInput('');
//     };
//     return (
//         <Card className="h-full w-full overflow-scroll scrollbar-hide bg-transparent shadow-none border-none flex flex-col justify-between">
//             <CardHeader>
//                 <CardTitle>Chat Assistant</CardTitle>
//                 <CardDescription>Ask questions and get help with tasks.</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <Conversation>
//                     <ConversationContent>
//                         {messages.map((message) => (
//                             <div key={message.id}>
//                                 {message.role === 'assistant' && message.parts.filter((part) => part.type === 'source-url').length > 0 && (
//                                     <Sources>
//                                         <SourcesTrigger
//                                             count={
//                                                 message.parts.filter(
//                                                     (part) => part.type === 'source-url',
//                                                 ).length
//                                             }
//                                         />
//                                         {message.parts.filter((part) => part.type === 'source-url').map((part, i) => (
//                                             <SourcesContent key={`${message.id}-${i}`}>
//                                                 <Source
//                                                     key={`${message.id}-${i}`}
//                                                     href={part.url}
//                                                     title={part.url}
//                                                 />
//                                             </SourcesContent>
//                                         ))}
//                                     </Sources>
//                                 )}
//                                 {message.parts.map((part, i) => {
//                                     switch (part.type) {
//                                         case 'text':
//                                             return (
//                                                 <Message key={`${message.id}-${i}`} from={message.role}>
//                                                     <MessageContent>
//                                                         <MessageResponse>
//                                                             {part.text}
//                                                         </MessageResponse>
//                                                     </MessageContent>
//                                                     {message.role === 'assistant' && i === messages.length - 1 && (
//                                                         <MessageActions>
//                                                             <MessageAction
//                                                                 onClick={() => regenerate()}
//                                                                 label="Retry"
//                                                             >
//                                                                 <RefreshCcwIcon className="size-3" />
//                                                             </MessageAction>
//                                                             <MessageAction
//                                                                 onClick={() =>
//                                                                     navigator.clipboard.writeText(part.text)
//                                                                 }
//                                                                 label="Copy"
//                                                             >
//                                                                 <CopyIcon className="size-3" />
//                                                             </MessageAction>
//                                                         </MessageActions>
//                                                     )}
//                                                 </Message>
//                                             );
//                                         case 'reasoning':
//                                             return (
//                                                 <Reasoning
//                                                     key={`${message.id}-${i}`}
//                                                     className="w-full"
//                                                     isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
//                                                 >
//                                                     <ReasoningTrigger />
//                                                     <ReasoningContent>{part.text}</ReasoningContent>
//                                                 </Reasoning>
//                                             );
//                                         default:
//                                             return null;
//                                     }
//                                 })}
//                             </div>
//                         ))}
//                         {status === 'submitted' && <Loader className="animate-spin mx-2 my-4 size-5 text-muted-foreground" />}
//                     </ConversationContent>
//                     <ConversationScrollButton />
//                 </Conversation>
//             </CardContent>
//             <CardFooter>
//                 <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
//                     <PromptInputHeader>
//                         <PromptInputAttachments>
//                             {(attachment) => <PromptInputAttachment data={attachment} />}
//                         </PromptInputAttachments>
//                     </PromptInputHeader>
//                     <PromptInputBody>
//                         <PromptInputTextarea
//                             onChange={(e) => setInput(e.target.value)}
//                             value={input}
//                         />
//                     </PromptInputBody>
//                     <PromptInputFooter>
//                         <PromptInputTools>
//                             <PromptInputActionMenu>
//                                 <PromptInputActionMenuTrigger />
//                                 <PromptInputActionMenuContent>
//                                     <PromptInputActionAddAttachments />
//                                 </PromptInputActionMenuContent>
//                             </PromptInputActionMenu>
//                             <PromptInputButton
//                                 variant={webSearch ? 'default' : 'ghost'}
//                                 onClick={() => setWebSearch(!webSearch)}
//                             >
//                                 <GlobeIcon size={16} />
//                                 <span>Search</span>
//                             </PromptInputButton>
//                             <PromptInputSelect
//                                 onValueChange={(value) => {
//                                     setModel(value);
//                                 }}
//                                 value={model}
//                             >
//                                 <PromptInputSelectTrigger>
//                                     <PromptInputSelectValue />
//                                 </PromptInputSelectTrigger>
//                                 <PromptInputSelectContent>
//                                     {models.map((model) => (
//                                         <PromptInputSelectItem key={model.value} value={model.value}>
//                                             {model.name}
//                                         </PromptInputSelectItem>
//                                     ))}
//                                 </PromptInputSelectContent>
//                             </PromptInputSelect>
//                         </PromptInputTools>
//                         <PromptInputSubmit disabled={!input && !status} status={status} />
//                     </PromptInputFooter>
//                 </PromptInput>
//             </CardFooter>
//         </Card>
//     );
// };
