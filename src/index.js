import { createRoot } from "react-dom/client";

import { NotificationContextContainer } from "./context/notification.jsx";
import Notification from "./components/Notification.jsx";

import App from "./App.jsx";
import "./app.css";

const container = document.getElementById("xynity-blocks-main-container");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <NotificationContextContainer>
        <App />
        <Notification />
    </NotificationContextContainer>
);
