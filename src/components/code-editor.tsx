import Editor, { OnChange } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useState } from 'react';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string | undefined): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const [value, setValue] = useState<string | undefined>(initialValue);

  const onEditorDidMount: OnChange = (value) => {
    setValue(value);
    onChange(value);
  };

  const onFormatClick = () => {
    if (value) {
      const formatted = prettier.format(value, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      }).replace(/\n$/, '');

      setValue(formatted);
      onChange(formatted);
    }
  };
  
  return (
    <div>
      <button onClick={onFormatClick}>Format</button>
      <Editor
        onChange={onEditorDidMount}
        value={value}
        height='500px'
        language='javascript'
        theme='vs-dark'
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
