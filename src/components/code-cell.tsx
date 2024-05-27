import { useEffect, useState } from 'react';
import bundle from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

const CodeCell = () => {
  const [code, setCode] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const [input, setInput] = useState<string | undefined>(
    `import 'bulma/css/bulma.css'; console.log('Hello, world!');`
  );

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input || '');
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={`const App = () => {
      return (
        <div> 
          <h1>asdqwe</h1>
          <button onClick={() => console.log('Click')}>Click me</button>
        </div>
      )
    }`}
            onChange={value => setInput(value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
