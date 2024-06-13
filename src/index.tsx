import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { createRoot } from 'react-dom/client';
// import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';

const appElement = document.getElementById('root');

if (!appElement) throw new Error('App element not found');

const root = createRoot(appElement);

const App = () => {

  return (
    <div>
      <TextEditor />
      {/* <CodeCell /> */}
    </div>
  );
};

root.render(<App />);
