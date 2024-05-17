import * as esbuild from 'esbuild-wasm';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CodeEditor from './components/code-editor';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';

const appElement = document.getElementById('root');

if (!appElement) throw new Error('App element not found');

const root = createRoot(appElement);

const App = () => {
  const [input, setInput] = useState<string | undefined>(`import 'bulma/css/bulma.css'; console.log('Hello, world!');`);
  const ref = useRef<any>();
  const iframe = useRef<any>();

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
    if (!ref.current || !input) return;
    iframe.current.srcdoc = html;

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

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  const html = `
    <html>
      <head>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', event => {
            try{
              eval(event.data);
            } catch(err) {
              const root = document.getElementById('root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
    `;

  return (
    <div>
      <CodeEditor initialValue='const a = 1' onChange={(value) => setInput(value)} />
      <textarea value={input} onChange={e => setInput(e.target.value)} rows={10} cols={50} />
      <div>
        <button onClick={onClick}>Submit!</button>
      </div>
      <iframe title='preview' ref={iframe} sandbox='allow-scripts allow-same-origin' srcDoc={html} />
    </div>
  );
};

root.render(<App />);
