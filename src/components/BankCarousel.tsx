
import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion } from 'framer-motion';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay && !selectedBank) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banks.length);
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, banks.length, selectedBank]);

  const handleBankClick = (bankId: string) => {
    if (onBankSelect) {
      setAutoplay(false);
      onBankSelect(bankId);
    }
  };

  // Stop autoplay when user interacts with carousel
  const handleUserInteraction = () => {
    setAutoplay(false);
  };

  return (
    <div className="w-full max-w-md mx-auto" onClick={handleUserInteraction}>
      <Carousel 
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {banks.map((bank) => (
            <CarouselItem key={bank.id} className="md:basis-1/3 lg:basis-1/4">
              <div 
                className={`h-28 flex flex-col items-center justify-center p-4 ${
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      <div className="flex justify-center mt-4 space-x-1">
        {banks.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index || selectedBank === banks[index].id
                ? 'w-4 bg-ksa-primary' 
                : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BankCarousel;
