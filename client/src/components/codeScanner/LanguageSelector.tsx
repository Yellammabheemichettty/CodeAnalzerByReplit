import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { getSupportedLanguages } from '../../lib/codeAnalysis';

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  disabled?: boolean;
}

export default function LanguageSelector({ value, onChange, disabled = false }: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const supportedLanguages = await getSupportedLanguages();
        setLanguages(supportedLanguages);
      } catch (error) {
        console.error("Error fetching supported languages:", error);
        // Fallback languages if API fails
        setLanguages([
          "javascript", "typescript", "python", "java", "csharp", 
          "cpp", "php", "ruby", "go", "rust", "swift", "kotlin", 
          "html", "css", "sql"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <div className="mb-4">
      <Label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
        Language (Optional)
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Auto-detect" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto-detect">Auto-detect</SelectItem>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
