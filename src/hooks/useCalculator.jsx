import { useState, useEffect, useCallback } from 'react';

export default function useCalculator() {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState(null);

  const formatNumber = useCallback((numberStr) => {
    const sNum = String(numberStr); // Ensure it's a string

    if (sNum === 'Error' || sNum === '' || sNum == null) return sNum;
    if (sNum === '0') return '0';
    if (sNum === '-') return '-'; // Handle lone negative sign
    if (sNum === '-0' && !sNum.includes('.')) return '-0'; // Keep "-0" unless it becomes "-0."

    // Display "." as "0." and "-." as "-0." for better UX
    if (sNum === '.') return '0.';
    if (sNum === '-.') return '-0.';
    
    const isNegative = sNum.startsWith('-');
    const absNumberString = isNegative ? sNum.substring(1) : sNum;
  
    const [integerPartString, decimalPartString] = absNumberString.split('.');
  
    let formattedInteger = "0"; 
    if (integerPartString && integerPartString !== "") {
        try {
            // Allow more precision for display than default toLocaleString if needed for large numbers
            formattedInteger = parseFloat(integerPartString).toLocaleString('en-US', {maximumFractionDigits: 20});
        } catch {
            formattedInteger = integerPartString; // Fallback
        }
    }
    
    let result = (isNegative ? '-' : '') + formattedInteger;
    
    if (decimalPartString != null) { // If there was a decimal point in original number
        result += `.${decimalPartString}`;
    } else if (absNumberString.endsWith('.') && !absNumberString.endsWith('..')) { // For "123." typed by user
        if(!formattedInteger.endsWith('.')) { // Avoid "123.." if locale adds dot
            result += '.';
        }
    }
    
    return result;
  }, []);

  const clear = useCallback(() => {
    setCurrentOperand('0');
    setPreviousOperand('');
    setOperation(null);
  }, []);

  const deleteLast = useCallback(() => {
    setCurrentOperand(co => {
      if (co === 'Error') return '0';
      if (co.length === 1 || (co.startsWith('-') && co.length === 2) ) return '0'; // Handles "-5" -> "0"
      return co.slice(0, -1);
    });
  }, []);

  const appendNumber = useCallback((number) => {
    setCurrentOperand(co => {
      if (co === 'Error') co = '0';
      if (number === '.' && co.includes('.')) return co;
      if (co === '0' && number !== '.') return number;
      if (co === '-0' && number !== '.') return '-' + number; // Allows -0. but changes -0 to -{digit}
      if (co === '0' && number === '0') return co; // Prevent "00"
      return co + number;
    });
  }, []);

  const compute = useCallback(() => {
    if (!previousOperand || !operation || currentOperand === '' || currentOperand === 'Error') {
      return;
    }
    
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) {
      setCurrentOperand('Error'); setPreviousOperand(''); setOperation(null); return;
    }

    let result;
    switch (operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '×': result = prev * current; break;
      case '÷':
        if (current === 0) {
          setCurrentOperand('Error'); setPreviousOperand(''); setOperation(null); return;
        }
        result = prev / current;
        break;
      default: return;
    }
    // Basic precision handling for floating point issues like 0.1 + 0.2
    // This can be made more robust if needed
    result = parseFloat(result.toPrecision(12)); 
    setCurrentOperand(result.toString());
    setOperation(null);
    setPreviousOperand('');
  }, [previousOperand, currentOperand, operation]);

  const chooseOperation = useCallback((nextOperation) => {
    if (currentOperand === 'Error') {
        setCurrentOperand('0');
        setPreviousOperand('0'); 
        setOperation(nextOperation);
        return;
    }

    if ((currentOperand === '0' || currentOperand === '') && previousOperand === '') {
        // Allow starting with a minus for negative numbers
        if (nextOperation === '-') {
            setCurrentOperand('-');
            return;
        }
        return;
    }
    
    if ((currentOperand === '0' || currentOperand === '' || currentOperand === '-') && previousOperand !== '') {
        setOperation(nextOperation);
        return;
    }

    if (previousOperand !== '' && operation) {
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);

        if (isNaN(prev) || isNaN(current)) {
            setCurrentOperand('Error'); setPreviousOperand(''); setOperation(null); return;
        }

        let intermediateResult;
        switch (operation) {
            case '+': intermediateResult = prev + current; break;
            case '-': intermediateResult = prev - current; break;
            case '×': intermediateResult = prev * current; break;
            case '÷':
                if (current === 0) {
                    setCurrentOperand('Error'); setPreviousOperand(''); setOperation(null); return;
                }
                intermediateResult = prev / current;
                break;
            default: return; 
        }
        intermediateResult = parseFloat(intermediateResult.toPrecision(12));
        setPreviousOperand(intermediateResult.toString());
    } else {
        setPreviousOperand(currentOperand);
    }

    setOperation(nextOperation);
    setCurrentOperand('0');
  }, [currentOperand, previousOperand, operation]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (key >= '0' && key <= '9') appendNumber(key);
      else if (key === '.') appendNumber('.');
      else if (key === '+' || key === '-') chooseOperation(key);
      else if (key === '*') chooseOperation('×');
      else if (key === '/') { event.preventDefault(); chooseOperation('÷'); }
      else if (key === 'Enter' || key === '=') { event.preventDefault(); compute(); }
      else if (key === 'Escape') clear();
      else if (key === 'Backspace') deleteLast();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendNumber, chooseOperation, compute, clear, deleteLast]);

  return {
    currentOperand, previousOperand, operation,
    clear, deleteLast, appendNumber, chooseOperation, compute, formatNumber,
  };
}