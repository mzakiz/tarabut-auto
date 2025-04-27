import React from 'react';
import { motion } from 'framer-motion';
import { Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language } = useLanguage();
  
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
    const selectedBankData = banks.find(bank => bank.id === bankId);
    
    if (selectedBankData) {
      Analytics.trackBankSelection({
        bank_id: bankId,
        bank_name: selectedBankData.name,
        language,
        screen: 'bank_selection'
      });
    }
    
    if (onBankSelect) {
      onBankSelect(bankId);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {banks.map((bank) => (
          <motion.div
            key={bank.id}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.3 
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer ${
              selectedBank === bank.id 
                ? 'border-ksa-primary bg-ksa-primary/5 scale-105' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleBankClick(bank.id)}
          >
            <div className={`p-3 rounded-full mb-2 ${selectedBank === bank.id ? 'bg-ksa-primary/10' : 'bg-gray-50'}`}>
              <img 
                src={bank.svgPath} 
                alt={bank.name} 
                className="h-12 w-12 object-contain"
              />
            </div>
            <p className="text-xs text-center mt-2 font-medium text-gray-700 truncate w-full">
              {bank.name}
            </p>
            {selectedBank === bank.id && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 w-4 h-4 rounded-full bg-ksa-primary flex items-center justify-center"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-2 h-2 rounded-full bg-white"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BankSelector;
