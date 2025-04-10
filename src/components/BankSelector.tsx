
import React, { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { motion } from 'framer-motion';

interface BankSymbol {
  id: string;
  name: string;
  svgPath: string;
}

interface BankSelectorProps {
  onBankSelect?: (bankId: string) => void;
  selectedBank?: string;
}

const BankSelector: React.FC<BankSelectorProps> = ({ onBankSelect, selectedBank }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const banks: BankSymbol[] = [
    { id: 'snb', name: 'Saudi National Bank', svgPath: '/Symbols/SNB_symbol.svg' },
    { id: 'rajhi', name: 'Al Rajhi Bank', svgPath: '/Symbols/Alrajhi_symbol.svg' },
    { id: 'albilad', name: 'Bank Albilad', svgPath: '/Symbols/BankAlBilad_symbol.svg' },
    { id: 'alinma', name: 'Alinma Bank', svgPath: '/Symbols/Alinma_symbol.svg' },
    { id: 'riyad', name: 'Riyad Bank', svgPath: '/Symbols/Riyadbank_symbol.svg' },
    { id: 'sab', name: 'Saudi British Bank (SABB)', svgPath: '/Symbols/SAB_symbol.svg' },
    { id: 'anb', name: 'Arab National Bank', svgPath: '/Symbols/ANB_symbol.svg' },
    { id: 'bsf', name: 'Banque Saudi Fransi', svgPath: '/Symbols/BSF_symbol.svg' },
    { id: 'jazira', name: 'Bank Aljazira', svgPath: '/Symbols/Aljazira_symbol.svg' },
    { id: 'sib', name: 'Saudi Investment Bank', svgPath: '/Symbols/Saudi_Investment_Bank_symbol.svg' },
    { id: 'gib', name: 'Gulf International Bank', svgPath: '/Symbols/GIB_symbol.svg' },
  ];

  const handleBankClick = (bankId: string) => {
    if (onBankSelect) {
      onBankSelect(bankId);
    }
  };

  return (
    <div className="w-full mx-auto">
      <Carousel className="w-full max-w-md mx-auto">
        <CarouselContent>
          {banks.map((bank) => (
            <CarouselItem key={bank.id} className="md:basis-1/4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center p-3 cursor-pointer ${
                  selectedBank === bank.id 
                    ? 'scale-110 opacity-100' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => handleBankClick(bank.id)}
              >
                <div className={`p-3 rounded-full ${selectedBank === bank.id ? 'bg-ksa-primary/10' : ''}`}>
                  <img 
                    src={bank.svgPath} 
                    alt={bank.name} 
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <p className="text-xs text-center mt-2 font-medium text-gray-700 truncate w-full">
                  {bank.name}
                </p>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center mt-4">
          <CarouselPrevious className="relative static translate-y-0 left-0 mr-2 h-8 w-8" />
          <CarouselNext className="relative static translate-y-0 right-0 h-8 w-8" />
        </div>
      </Carousel>
      
      <div className="flex justify-center mt-4 space-x-1">
        {Array.from({ length: Math.ceil(banks.length / 4) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
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

export default BankSelector;
