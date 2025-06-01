import React from 'react';
import useCalculator from '../hooks/useCalculator';
import Button from './Button';
import Display from './Display';

export default function Calculator() {
  const {
    currentOperand,
    previousOperand,
    operation,
    clear,
    deleteLast,
    appendNumber,
    chooseOperation,
    compute,
    formatNumber
  } = useCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 
                    flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl 
                      border border-white/20 w-full max-w-sm">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-light text-white">React Calculator</h1>
        </div>

        <Display
          currentOperand={currentOperand}
          previousOperand={previousOperand}
          operation={operation}
          formatNumber={formatNumber}
        />

        <div className="grid grid-cols-4 gap-4">
          <Button onClick={clear} className="col-span-2 bg-red-500/70 hover:bg-red-500/90">Clear</Button>
          <Button onClick={deleteLast} className="bg-orange-500/70 hover:bg-orange-500/90">⌫</Button>
          <Button onClick={() => chooseOperation('÷')} className="bg-orange-500/70 hover:bg-orange-500/90">÷</Button>

          <Button onClick={() => appendNumber('7')}>7</Button>
          <Button onClick={() => appendNumber('8')}>8</Button>
          <Button onClick={() => appendNumber('9')}>9</Button>
          <Button onClick={() => chooseOperation('×')} className="bg-orange-500/70 hover:bg-orange-500/90">×</Button>

          <Button onClick={() => appendNumber('4')}>4</Button>
          <Button onClick={() => appendNumber('5')}>5</Button>
          <Button onClick={() => appendNumber('6')}>6</Button>
          <Button onClick={() => chooseOperation('-')} className="bg-orange-500/70 hover:bg-orange-500/90">-</Button>

          <Button onClick={() => appendNumber('1')}>1</Button>
          <Button onClick={() => appendNumber('2')}>2</Button>
          <Button onClick={() => appendNumber('3')}>3</Button>
          <Button onClick={() => chooseOperation('+')} className="bg-orange-500/70 hover:bg-orange-500/90">+</Button>

          <Button onClick={() => appendNumber('0')} className="col-span-2">0</Button>
          <Button onClick={() => appendNumber('.')}>.</Button>
          <Button onClick={compute} className="bg-blue-500/70 hover:bg-blue-500/90">=</Button>
        </div>
        
        <div className="text-center mt-6 text-white/60 text-sm">
          Use keyboard or click buttons
        </div>
      </div>
    </div>
  );
}