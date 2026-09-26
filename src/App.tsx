import { Toaster } from 'sonner';
import { TaskBoard } from './components/TaskBoard';

function App() {
  return (
    <>
      <TaskBoard />
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;
