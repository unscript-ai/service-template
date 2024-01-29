import { vartalapInternal } from '@config';
const { fetch } = require('sarthi').common.helpers.utils;

export class VartalapInternal {
  public sendHSM = async (
    contact_number: string,
    templateId: string,
    templateArguments: any,
    delay = 0,
    encoding = 'text',
    sellerId: string,
  ): Promise<any> => {
    return await fetch(`${vartalapInternal}/wa-chat/send-hsm`, {
      method: 'POST',
      body: JSON.stringify({
        customer_contact_number: contact_number,
        template_id: templateId,
        template_arguments: templateArguments,
        delay,
        encoding,
        seller_id: sellerId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  };
}
