import { URL } from 'url';
import fetch from 'node-fetch';
import * as config from '@config';
const MessagingConfig = config.messaging_service;

export default class MessagingService {
  private MessagingApi = MessagingConfig.api;
  private userId = MessagingConfig.user_id;
  private priorirtUserId = MessagingConfig.priority_user_id;
  private password = MessagingConfig.password;
  private priorirtPassword = MessagingConfig.priority_password;

  public sendText = async (contact_number: string, message: string, hasPriority = false): Promise<any> => {
    const myURL = new URL(this.MessagingApi);
    myURL.searchParams.set('method', 'SendMessage');
    myURL.searchParams.set('send_to', contact_number);
    myURL.searchParams.set('msg_type', 'TEXT');
    myURL.searchParams.set('userid', hasPriority ? this.priorirtUserId : this.userId);
    myURL.searchParams.set('auth_scheme', 'plain');
    myURL.searchParams.set('password', hasPriority ? this.priorirtPassword : this.password);
    myURL.searchParams.set('v', '1.1');
    myURL.searchParams.set('format', 'json');

    const apiCall = myURL.href + '&msg=' + encodeURIComponent(message);

    return fetch(apiCall, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(res => res.response);
  };
}
