import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import API_URL from '../../../utils/api';

const MiniChatBot = ({ patientId, patientName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `¡Hola! Soy tu asistente médico de IA. Estoy listo para responder preguntas sobre el paciente **${patientName}**. Puedes preguntarme sobre medicamentos, interacciones, síntomas, o cualquier duda clínica.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ia911_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_URL}/analysis/${patientId}/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message: trimmed,
          conversationHistory
        })
      });

      if (response.status === 401) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
        }]);
        return;
      }

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply
        }]);
        return;
      }

      throw new Error('Sin respuesta');
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat reiniciado. ¿En qué puedo ayudarte sobre el paciente **${patientName}**?`
    }]);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-primary hover:bg-primary/90 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group"
          style={{ 
            animation: 'chatPulse 2s infinite',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)'
          }}
        >
          <Icon name="MessageCircle" size={24} className="text-white" />
          <span className="font-semibold text-sm">Chat con IA</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-error hover:bg-error/90 transition-all duration-300"
        >
          <Icon name="X" size={24} className="text-white" />
        </button>
      )}

      <style>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 4px 30px rgba(59, 130, 246, 0.8); }
        }
      `}</style>

      {/* Panel del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] border border-border rounded-2xl flex flex-col overflow-hidden"
          style={{ height: '500px', backgroundColor: '#ffffff', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Bot" size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Asistente IA</h3>
                <p className="text-white/70 text-xs">Contexto: {patientName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Limpiar conversación"
              >
                <Icon name="RotateCcw" size={16} className="text-white/80" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Minimizar"
              >
                <Icon name="Minus" size={16} className="text-white/80" />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#f8fafc' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'rounded-bl-md border border-gray-200'
                  }`}
                  style={msg.role !== 'user' ? { backgroundColor: '#ffffff', color: '#1e293b' } : undefined}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md" style={{ backgroundColor: '#ffffff' }}>
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex-shrink-0" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-end space-x-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta sobre el paciente..."
                rows={1}
                className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary max-h-20"
                style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                title="Enviar mensaje"
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              IA de simulación — No reemplaza diagnósticos reales
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MiniChatBot;
