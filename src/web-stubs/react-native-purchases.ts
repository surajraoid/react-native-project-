export const LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, VERBOSE: 4, SILENT: 5 };
export const PURCHASE_TYPE = { INAPP: 'inapp', SUBS: 'subs' };

const Purchases = {
  configure: async () => {},
  setLogLevel: () => {},
  getCustomerInfo: async () => ({ entitlements: { active: {} }, activeSubscriptions: [] }),
  purchasePackage: async () => ({ customerInfo: { entitlements: { active: {} } } }),
  restorePurchases: async () => ({ entitlements: { active: {} } }),
  isConfigured: async () => false,
  getOfferings: async () => ({ current: null, all: {} }),
  setAttributes: async () => {},
  logIn: async () => ({ customerInfo: { entitlements: { active: {} } }, created: false }),
  logOut: async () => ({ entitlements: { active: {} } }),
};

export default Purchases;
