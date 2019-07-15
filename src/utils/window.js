import {notification} from 'antd';

// Notification通知提醒框
export const openNotificationWithIcon = (type, message, description) => notification[type]({
    message: message,
    description: description,
});
