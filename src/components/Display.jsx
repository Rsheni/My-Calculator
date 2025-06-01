import React from 'react';

const Display = ({ currentOperand, previousOperand, operation, formatNumber }) => {
  return (
    <div className="bg-black/30 rounded-2xl p-6 mb-6 text-right min-h-[5rem] 
                    flex flex-col justify-center">
      <div className="text-white/70 text-sm min-h-[1.25rem] mb-1 truncate">
        {previousOperand && operation ? `${formatNumber(previousOperand)} ${operation}` : ''}
      </div>
      <div className="text-white text-3xl font-light break-all">
        {formatNumber(currentOperand)}
      </div>
    </div>
  );
};

export default Display;