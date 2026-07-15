import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import API_URL from '../../../utils/api';
import { getDemoChatReply } from '../../../utils/demoMode';

const GeneralChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getUserName = () => {
    try {
      const userData = localStorage.getItem('ia911_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.nombre || user.name || 'Doctor';
      }
    } catch { /* ignore */ }
    return 'Doctor';
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ia911_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Mensaje de bienvenida al montar
  useEffect(() => {
    const name = getUserName();
    setMessages([{
      role: 'assistant',
      content: `¡Bienvenido/a, **Dr. ${name}**! Soy tu asistente clínico IA-911.\n\nPuedo ayudarte con:\n• **Resumen general** de todos los pacientes\n• **Estadísticas** por nivel de urgencia\n• **Consultas específicas** sobre cualquier paciente\n• **Recomendaciones clínicas** y protocolos\n\n¿En qué puedo asistirte?`
    }]);
  }, []);

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
        .filter((m, i) => i > 0)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_URL}/chat`, {
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
      const demoReply = getDemoChatReply(trimmed);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: demoReply
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
    const name = getUserName();
    setMessages([{
      role: 'assistant',
      content: `Chat reiniciado. ¿En qué puedo ayudarte, **Dr. ${name}**?`
    }]);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const quickQuestions = [
    '¿Cuántos pacientes hay?',
    'Resumen de pacientes críticos',
    'Pacientes que necesitan atención inmediata'
  ];

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
          style={{ 
            backgroundColor: '#1e40af',
            color: '#ffffff',
            boxShadow: '0 4px 25px rgba(30, 64, 175, 0.5)',
            animation: 'dashChatPulse 2s infinite'
          }}
        >
          <Icon name="MessageCircle" size={24} className="text-white" />
          <span className="font-semibold text-sm">Asistente IA-911</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: '#dc2626' }}
        >
          <Icon name="X" size={24} className="text-white" />
        </button>
      )}

      <style>{`
        @keyframes dashChatPulse {
          0%, 100% { box-shadow: 0 4px 25px rgba(30, 64, 175, 0.5); }
          50% { box-shadow: 0 4px 35px rgba(30, 64, 175, 0.8); }
        }
      `}</style>

      {/* Panel del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] border rounded-2xl flex flex-col overflow-hidden"
          style={{ height: '550px', backgroundColor: '#ffffff', borderColor: '#e2e8f0', boxShadow: '0 10px 50px rgba(0,0,0,0.3)' }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between flex-shrink-0"
            style={{ backgroundColor: '#1e40af' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Icon name="Bot" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Asistente IA-911</h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Chat General — Todos los pacientes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg transition-colors"
                style={{ ':hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                title="Limpiar conversación"
              >
                <Icon name="RotateCcw" size={16} className="text-white/80" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                title="Minimizar"
              >
                <Icon name="Minus" size={16} className="text-white/80" />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#f1f5f9' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                    style={{ backgroundColor: '#1e40af' }}
                  >
                    <Icon name="Bot" size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                  }`}
                  style={msg.role === 'user' 
                    ? { backgroundColor: '#1e40af', color: '#ffffff' }
                    : { backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0' }
                  }
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            ))}

            {/* Preguntas rápidas - solo al inicio */}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 mt-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(q); }}
                    className="text-xs px-3 py-1.5 rounded-full transition-colors"
                    style={{ backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}
                    onMouseEnter={e => { e.target.style.backgroundColor = '#bfdbfe'; }}
                    onMouseLeave={e => { e.target.style.backgroundColor = '#dbeafe'; }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                  style={{ backgroundColor: '#1e40af' }}
                >
                  <Icon name="Bot" size={14} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#94a3b8', animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#94a3b8', animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#94a3b8', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 flex-shrink-0" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <div className="flex items-end space-x-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta sobre pacientes, estadísticas, protocolos..."
                rows={1}
                className="flex-1 resize-none rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 max-h-20"
                style={{ 
                  backgroundColor: '#f1f5f9', 
                  color: '#1e293b', 
                  border: '1px solid #cbd5e1',
                  focusRingColor: '#1e40af'
                }}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-2.5 text-white rounded-xl transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1e40af' }}
                title="Enviar mensaje"
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeneralChatBot;
