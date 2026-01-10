import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Register from "./pages/Register";

function App() {
    return (<>
        <Routes>
            <Route path="/register" element={<Register />}/>
            <Route path="/" element={
                <>
                    <Header />
                </>
            } />
        </Routes>
    </>);
}

export default App;