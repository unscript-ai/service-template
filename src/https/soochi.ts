import { soochiInternal } from '@config';
const { fetch } = require('sarthi').common.helpers.utils;

export default class SoochiInternal {
  public replaceUserBagCataloguesWithVistor = async ({ visitor_id, user_id, seller_id }): Promise<any> => {
    return await fetch(`${soochiInternal}/bag/replace-user-bag-with-visitor`, {
      method: 'PUT',
      body: JSON.stringify({ visitor_id, user_id, seller_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  public replaceVisitorWithUserInRetargetCustomer = async ({ user_id, visitor_id, contact_number }): Promise<any> => {
    return await fetch(`${soochiInternal}/retarget-customer/replace-visitor`, {
      method: 'POST',
      body: JSON.stringify({ visitor_id, user_id, contact_number }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
}
