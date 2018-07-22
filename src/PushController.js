import { Component } from 'react';
import { Platform } from 'react-native';
import FCM, { FCMEvent, RemoteNotificationResult,
  WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

class PushController extends Component {
  componentDidMount() {
    FCM.requestPermissions({ badge: false, sound: true, alert: true });
    FCM.getFCMToken().then(token => {
      console.warn(token);
      console.log(token);
      // store fcm token in your server
    });
    this.notificationListner = FCM.on(FCMEvent.Notification, notif => {
      console.log('Notification', notif);
      console.warn('Notification', notif);
      if (notif.local_notification) {
        return;
      }
      if (notif.opened_from_tray) {
        return;
      }

      if (Platform.OS === 'ios') {
              switch (notif._notificationType) {
                case NotificationType.Remote:
                  notif.finish(RemoteNotificationResult.NewData);
                  break;
                case NotificationType.NotificationResponse:
                  notif.finish();
                  break;
                case NotificationType.WillPresent:
                  notif.finish(WillPresentNotificationResult.All);
                  break;
              }
      }
      this.showLocalNotification(notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      console.log('TOKEN (refreshUnsubscribe)', token);
    });
  }

  showLocalNotification(notif) {
    FCM.presentLocalNotification({
      title: notif.title,
      body: notif.body,
      priority: 'high',
      click_action: notif.click_action,
      show_in_foreground: true,
      local: true
    });
  }

  render() {
    return null;
  }
}

export default PushController;
