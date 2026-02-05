import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { KanbanBoard } from './components/KanbanBoard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/board/:id" element={<KanbanBoard />} />
                <Route path="/" element={<div className="p-10 text-center">
                    <button className="bg-blue-600 text-white p-4 rounded" onClick={() => window.location.href = '/board/default'}>
                        Go to Default Board
                    </button>
                </div>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;