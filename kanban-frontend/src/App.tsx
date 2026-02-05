import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { KanbanBoard } from './components/KanbanBoard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/board/default" replace />} />

                <Route path="/board/:id" element={<KanbanBoard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;