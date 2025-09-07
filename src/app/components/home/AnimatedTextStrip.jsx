'use client';

import React, { useState, useEffect } from 'react';

const AnimatedTextStrip = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  
  const texts = [
    "Find sellers before they list 🚀",
    "Get accurate listing prices 💰",
    "Rank CRM leads by sale probability score 🎯"
  ];

  // Function to properly split text including emojis
  const getTextChars = (text) => {
    return Array.from(text);
  };

  useEffect(() => {
    const currentText = texts[currentIndex];
    const textChars = getTextChars(currentText);
    
    if (isTyping) {
      if (charIndex < textChars.length) {
        const timeout = setTimeout(() => {
          setDisplayText(textChars.slice(0, charIndex + 1).join(''));
          setCharIndex(charIndex + 1);
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(textChars.slice(0, charIndex - 1).join(''));
          setCharIndex(charIndex - 1);
        }, 20);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, currentIndex, texts]);

  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-600 py-8 mt-6">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center">
          <div className="h-24 flex items-center justify-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              {displayText}
              <span className="animate-pulse">|</span>
            </h2>
          </div>
          {/* <p className="text-gray-400 text-lg mt-4">
            A complete tech ecosystem to put your business{' '}
            <span className="text-blue-400 font-semibold">growth on AI</span>
          </p> */}
        </div>
      </div>
    </section>
  );
};

export default AnimatedTextStrip;
