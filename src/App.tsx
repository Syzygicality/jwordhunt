import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Register from "./pages/Register";
import Chat from "./pages/Chat"

function App() {
    return (<>
        <Routes>
            <Route path="/register" element={<Register />}/>
            <Route path="/chat" element={<Chat />}/>
            <Route path="/" element={
                <>
                    <Header />
                </>
            } />
        </Routes>
    </>);
}

export default App;