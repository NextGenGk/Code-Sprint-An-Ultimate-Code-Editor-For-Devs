'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Upload, Palette } from 'lucide-react';

interface CodeEditorProps {
  onSubmit: (code: string, language: string) => void;
  onRun: (code: string, language: string) => void;
  loading?: boolean;
  initialCode?: Record<string, string>;
  problemId?: string;
  onCodeChange?: (code: string, language: string) => void;
  onPasteAutoSubmit?: (action: string) => void;
  canSubmit?: boolean;
}

const LANGUAGE_CONFIGS = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    template: `// Driver code will handle input/output
// Focus only on implementing the solution
function twoSum(nums, target) {
    // TODO: Implement solution
    return [];
}`
  },
  python: {
    id: 'python',
    name: 'Python',
    template: `# Driver code will handle input/output
# Focus only on implementing the solution
class Solution:
    def twoSum(self, nums, target):
        # TODO: Implement solution
        return []`
  },
  java: {
    id: 'java',
    name: 'Java',
    template: `// Driver code will handle input/output
// Focus only on implementing the solution
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // TODO: Implement solution
        return new int[0];
    }
}`
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    template: `// Driver code will handle input/output
// Focus only on implementing the solution
vector<int> twoSum(vector<int>& nums, int target) {
    // TODO: Implement solution
    return {};
}`
  }
};

const THEME_CONFIGS = [
  { id: 'vs-dark', name: 'Dark', description: 'Default dark theme' },
  { id: 'vs-light', name: 'Light', description: 'Default light theme' },
  { id: 'hc-black', name: 'High Contrast', description: 'High contrast dark' },
  { id: 'hc-white', name: 'High Contrast Light', description: 'High contrast light' },
];

export function CodeEditor({ onSubmit, onRun, loading, initialCode, problemId, onCodeChange, onPasteAutoSubmit, canSubmit }: CodeEditorProps) {
  const [language, setLanguage] = useState('javascript');
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState('vs-dark');
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();

  // Initialize code for each language
  const getCurrentCode = () => {
    return codeByLanguage[language] || 
           initialCode?.[language] || 
           LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS].template;
  };

  const [code, setCode] = useState(getCurrentCode());

  // Update code when language changes, preserving user edits
  useEffect(() => {
    setCode(getCurrentCode());
  }, [language, initialCode, codeByLanguage]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts when monaco is available
    if (monaco) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onSubmit(code, language);
      });
      
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
        onRun(code, language);
      });
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={(newLang) => {
            // Save current code before switching
            setCodeByLanguage(prev => ({ ...prev, [language]: code }));
            setLanguage(newLang);
          }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-24">
              <Palette className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              {THEME_CONFIGS.map((themeConfig) => (
                <SelectItem key={themeConfig.id} value={themeConfig.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{themeConfig.name}</span>
                    <span className="text-xs text-muted-foreground">{themeConfig.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => onRun(code, language)}
            disabled={loading}
          >
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button
            onClick={() => onSubmit(code, language)}
            disabled={loading || !canSubmit}
            title={!canSubmit ? "Please run your code successfully before submitting" : ""}
          >
            <Upload className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => {
            const newCode = value || '';
            setCode(newCode);
            setCodeByLanguage(prev => ({ ...prev, [language]: newCode }));
            if (typeof value === 'string' && typeof language === 'string' && typeof onCodeChange === 'function') {
              onCodeChange(value, language);
            }
          }}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            contextmenu: false
          }}
        />
      </div>
    </div>
  );
}