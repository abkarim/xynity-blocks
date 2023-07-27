import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();
const NotificationContextUpdate = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function useNotificationUpdate() {
  return useContext(NotificationContextUpdate);
}

export function NotificationContextContainer({ children }) {
  const [notification, setNotification] = useState({});
  const updateNotification = (data) => {
    setNotification(data);
  };
  return (
    <NotificationContext.Provider value={notification}>
      <NotificationContextUpdate.Provider value={updateNotification}>
        {children}
      </NotificationContextUpdate.Provider>
    </NotificationContext.Provider>
  );
}
