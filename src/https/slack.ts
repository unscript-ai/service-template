import fetch from 'node-fetch';
import { is_production, slack } from '@/config';

export default class SlackAlert {
  private sendMessage = (channel: string, message: string): any => {
    return (
      is_production &&
      fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        body: JSON.stringify({
          channel,
          text: message,
          token: slack.slackAccessToken,
          as_user: false,
        }),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Bearer ${slack.slackAccessToken}`,
        },
      })
    );
  };

  public slackAtNuShopProdErrors = (message: string): any => {
    return this.sendMessage('nushop_prod_errors', message);
  };
}
