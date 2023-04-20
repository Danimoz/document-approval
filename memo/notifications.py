from django.conf import settings
from django.core.mail import send_mail
import requests
import logging

def sendNotifications(to, title, message):
  try:
    url = 'https://fcm.googleapis.com/fcm/send'
    headers = {
      'Authorization': f'key={settings.FCM_SERVER_KEY}',
      'Content-Type': 'application/json'
    }
    data = {
      'to': to,
      'data': {
        'notification': {
          'title': title,
          'body': message
        }
      }
    }
    response = requests.post(url, json=data, headers=headers)
  except Exception as e:
    logger = logging.getLogger(__name__)
    logger.error(f'Error sending Notification: {e}')
    

def mailNotifications(to, title, message):
  try:
    send_mail(
      title,
      message,
      f'Clearline Workflow <h.clearline@clearlinehmo.net>',
      [to],
      fail_silently=True
    )
  except Exception as e:
    logger = logging.getLogger(__name__)
    logger.error(f'Error sending email: {e}')