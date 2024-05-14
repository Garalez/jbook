import * as esbuild from 'esbuild-wasm';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';

const appElement = document.getElementById('root');

if (!appElement) throw new Error('App element not found');

const root = createRoot(appElement);

const App = () => {
  const [input, setInput] = useState(`import 'bulma/css/bulma.css'`);
  const [code, setCode] = useState('');
  const ref = useRef<any>(null);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) return;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={10}
        cols={50}></textarea>
      <div>
        <button onClick={onClick}>Submit!</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

root.render(<App />);
