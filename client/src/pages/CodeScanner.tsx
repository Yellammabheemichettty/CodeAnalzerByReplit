import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';
import CodeEditor from '../components/codeScanner/CodeEditor';
import FileUpload from '../components/codeScanner/FileUpload';
import LanguageSelector from '../components/codeScanner/LanguageSelector';
import AnalysisResults from '../components/codeScanner/AnalysisResults';
import { analyzeCode } from '../lib/codeAnalysis';
import type { CodeAnalysisResponse } from '../lib/types';
import { useToast } from '../hooks/use-toast';

export default function CodeScanner() {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('auto-detect');
  const [filename, setFilename] = useState<string>('');
  const { toast } = useToast();

  const analyzeCodeMutation = useMutation({
    mutationFn: async () => {
      if (!code.trim()) {
        throw new Error('Please enter or upload some code to analyze');
      }
      return await analyzeCode(code, language === 'auto-detect' ? undefined : language);
    },
    onError: (error) => {
      toast({
        title: 'Analysis failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleUpload = (content: string, name: string) => {
    setCode(content);
    setFilename(name);
    // Optionally extract language from file extension
    const extensionMatch = name.match(/\.([^.]+)$/);
    if (extensionMatch) {
      const extension = extensionMatch[1].toLowerCase();
      // Map common extensions to languages
      const extensionMap: Record<string, string> = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cs': 'csharp',
        'cpp': 'cpp',
        'c': 'c',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'html': 'html',
        'css': 'css',
        'sql': 'sql',
      };
      
      if (extension in extensionMap) {
        setLanguage(extensionMap[extension]);
      }
    }
  };

  const handleClearCode = () => {
    setCode('');
    setFilename('');
    setLanguage('auto-detect');
  };

  const handleAnalyze = () => {
    analyzeCodeMutation.mutate();
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      {/* App Main Tabs */}
      <div className="border-b border-gray-200">
        <Tabs defaultValue="code-scanner">
          <TabsList className="flex -mb-px">
            <TabsTrigger 
              value="code-scanner" 
              className="border-b-2 whitespace-nowrap py-4 px-6 text-sm focus:outline-none"
            >
              Code Scanner
            </TabsTrigger>
            <TabsTrigger 
              value="batch-analyzer" 
              className="border-b-2 whitespace-nowrap py-4 px-6 text-sm focus:outline-none"
              disabled
            >
              Batch Analyzer
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="border-b-2 whitespace-nowrap py-4 px-6 text-sm focus:outline-none"
              disabled
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code-scanner" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4">
              {/* Code Input Panel */}
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  onClear={handleClearCode}
                />

                <FileUpload onUpload={handleUpload} />

                <LanguageSelector
                  value={language}
                  onChange={setLanguage}
                  disabled={analyzeCodeMutation.isPending}
                />

                <div className="mt-6">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!code.trim() || analyzeCodeMutation.isPending}
                    className="w-full"
                  >
                    {analyzeCodeMutation.isPending ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Analyze Code
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Analysis Results Panel */}
              <AnalysisResults
                result={analyzeCodeMutation.data as CodeAnalysisResponse | null}
                isLoading={analyzeCodeMutation.isPending}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
