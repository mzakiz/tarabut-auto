
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BankSymbol {
  id: string;
  name: string;
  svgPath: string;
}

interface BankCarouselProps {
  onBankSelect?: (bankId: string) => void;
  selectedBank?: string;
}

const BankCarousel: React.FC<BankCarouselProps> = ({ onBankSelect, selectedBank }) => {
  const [visibleBanks, setVisibleBanks] = useState<BankSymbol[]>([]);
  const [autoplay, setAutoplay] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
  const banks: BankSymbol[] = [
    { id: 'snb', name: 'Saudi National Bank', svgPath: '/public/Symbols/SNB_symbol.svg' },
    { id: 'rajhi', name: 'Al Rajhi Bank', svgPath: '/public/Symbols/Alrajhi_symbol.svg' },
    { id: 'albilad', name: 'Bank Albilad', svgPath: '/public/Symbols/BankAlBilad_symbol.svg' },
    { id: 'alinma', name: 'Alinma Bank', svgPath: '/public/Symbols/Alinma_symbol.svg' },
    { id: 'riyad', name: 'Riyad Bank', svgPath: '/public/Symbols/Riyadbank_symbol.svg' },
    { id: 'sab', name: 'Saudi British Bank (SABB)', svgPath: '/public/Symbols/SAB_symbol.svg' },
    { id: 'anb', name: 'Arab National Bank', svgPath: '/public/Symbols/ANB_symbol.svg' },
    { id: 'bsf', name: 'Banque Saudi Fransi', svgPath: '/public/Symbols/BSF_symbol.svg' },
    { id: 'jazira', name: 'Bank Aljazira', svgPath: '/public/Symbols/Aljazira_symbol.svg' },
    { id: 'sib', name: 'Saudi Investment Bank', svgPath: '/public/Symbols/Saudi_Investment_Bank_symbol.svg' },
    { id: 'gib', name: 'Gulf International Bank', svgPath: '/public/Symbols/GIB_symbol.svg' },
  ];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(banks.length / itemsPerPage);

  // Update visible banks when page changes
  useEffect(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setVisibleBanks(banks.slice(startIndex, endIndex));
  }, [currentPage]);

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay && !selectedBank) {
      interval = setInterval(() => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, selectedBank, totalPages]);

  const handleBankClick = (bankId: string) => {
    if (onBankSelect) {
      setAutoplay(false);
      onBankSelect(bankId);
    }
  };

  const handleUserInteraction = () => {
    setAutoplay(false);
  };

  const goToNextPage = () => {
    handleUserInteraction();
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const goToPrevPage = () => {
    handleUserInteraction();
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  return (
    <div className="w-full max-w-md mx-auto" onClick={handleUserInteraction}>
      <div className="relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPrevPage} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Previous banks"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button 
            onClick={goToNextPage} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Next banks"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
        
        <motion.div 
          className="grid grid-cols-4 gap-4"
          initial={{ opacity: 1 }}
        >
          <AnimatePresence mode="wait">
            {visibleBanks.map((bank) => (
              <motion.div
                key={bank.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col items-center justify-center p-3 ${
                  selectedBank === bank.id 
                    ? 'scale-110 opacity-100' 
                    : 'opacity-70 hover:opacity-100'
                } transition-all duration-300 cursor-pointer`}
                onClick={() => handleBankClick(bank.id)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-full ${selectedBank === bank.id ? 'bg-ksa-primary/10' : ''}`}
                >
                  <img 
                    src={bank.svgPath} 
                    alt={bank.name} 
                    className="h-12 w-12 object-contain"
                  />
                </motion.div>
                <p className="text-xs text-center mt-2 font-medium text-gray-700 truncate w-full">
                  {bank.name}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex justify-center mt-4 space-x-1">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentPage(index);
              handleUserInteraction();
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentPage === index
                ? 'w-6 bg-ksa-primary' 
                : 'w-2 bg-gray-300'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BankCarousel;
