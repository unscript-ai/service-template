import { aadeshInternal } from '@config';
const { fetch } = require('sarthi').common.helpers.utils;

export default class AadeshInternal {
  public createDefaultRateCardOfSeller = async (sellerId: string): Promise<any> => {
    return await fetch(`${aadeshInternal}/tpl-rate-card/${sellerId}`, {
      method: 'POST',
    }).then((res: any) => res.message);
  };
}
