import { soochiInternal } from '@config';
const { fetch } = require('sarthi').common.helpers.utils;
//TODO: replace soochiInternal to prashthInternal
export default class PrashthInternal {
  public createDefaultDemoWebsiteForSeller = async (sellerId: string): Promise<any> => {
    return await fetch(`${soochiInternal}/default-website/${sellerId}`, {
      method: 'POST',
    })
      .then((res: any) => res.messge)
      .catch(err => null);
  };
}
