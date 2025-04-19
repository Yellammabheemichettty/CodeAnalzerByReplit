import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Clipboard } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onClear: () => void;
}

export default function CodeEditor({ code, onChange, onClear }: CodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split("\n").length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  // Sync textarea and line numbers scroll
  const syncScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle tab key (insert spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newText = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newText);
      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Input Code</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClear}
            className="inline-flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePaste}
            className="inline-flex items-center"
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Paste
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden mb-4">
        <div className="flex items-stretch h-96">
          <div 
            ref={lineNumbersRef}
            className="code-line-numbers p-2 bg-gray-50 text-xs font-mono overflow-hidden"
            style={{ width: '50px', userSelect: 'none' }}
          >
            {lineNumbers.map((num) => (
              <div key={num} className="text-right pr-2 text-gray-500">{num}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 font-mono text-sm resize-none focus:outline-none"
            placeholder="Paste or type your code here..."
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
