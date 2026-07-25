import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

  const [notifications, setNotifications] = useState([]);

  const addNotification = (title, message) => {

    const newNotification = {
      id: Date.now(),
      title,
      message,
      time: new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () =>
  useContext(NotificationContext);