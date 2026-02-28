export const printStyles = `
  @media print {
    @page { margin: 2cm; }
    
    /* Reset body and ensure white background */
    body { 
      background: white !important; 
      color: black !important; 
      overflow: visible !important;
    }

    /* Hide non-print elements */
    .print-hidden { display: none !important; }
    .print-visible { display: block !important; }
    .no-print { display: none !important; }
    
    /* Reset all positioning and z-indexes for print flow */
    main, div, section, article {
      position: static !important;
      z-index: auto !important;
    }

    /* Disable all animations and transitions */
    * {
      animation: none !important;
      transition: none !important;
      transform: none !important;
      opacity: 1 !important;
      -webkit-print-color-adjust: exact !important; 
      print-color-adjust: exact !important;
    }

    /* Aggressively remove dark backgrounds and shadows */
    [class*="bg-"], [class*="shadow-"], [class*="backdrop-"] {
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
    }

    /* Add borders to cards for structure since backgrounds are gone */
    .border, [class*="border-"] {
      border-color: #e5e7eb !important;
      border-width: 1px !important;
      border-style: solid !important;
    }

    /* Force text colors */
    [class*="text-zinc-"], [class*="text-gray-"], [class*="text-slate-"], .text-white { color: #1f2937 !important; }
    [class*="text-emerald-"], [class*="text-green-"] { color: #059669 !important; }
    [class*="text-red-"], [class*="text-rose-"] { color: #dc2626 !important; }
    [class*="text-amber-"], [class*="text-yellow-"], [class*="text-orange-"] { color: #d97706 !important; }
    [class*="text-blue-"], [class*="text-sky-"], [class*="text-cyan-"] { color: #2563eb !important; }
    [class*="text-violet-"], [class*="text-purple-"], [class*="text-indigo-"] { color: #7c3aed !important; }
    
    /* Fix ScrollArea clipping */
    [data-slot="scroll-area-viewport"], [data-slot="scroll-area"] {
      height: auto !important;
      overflow: visible !important;
      display: block !important;
    }
    
    .break-after-page { break-after: page; }
  }
`;
