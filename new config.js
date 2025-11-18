const gtagSet = require('gtagSet');
gtagSet('developer_id.dMDAwNW', true);

const log = require('logToConsole');
const makeNumber = require('makeNumber');
const setDefaultConsentState = require('setDefaultConsentState');
const updateConsentState = require('updateConsentState');
const injectScript = require('injectScript');
const queryPermission = require('queryPermission');
const copyFromWindow = require('copyFromWindow');
const createQueue = require('createQueue');

let dataLayerPush  = createQueue('dataLayer');

log('data', data);
log(
    'defaultConsentState',
    {
      'analytics_storage': data.analytical,
      'ad_storage': data.marketing,
      'ad_user_data': data.marketing,
      'ad_personalization':data.marketing,
      'personalization_storage': data.marketing,
      'functionality_storage': 'granted',
      'security_storage': 'granted',
      'wait_for_update': makeNumber(data.wait_for_update)
    }
);
// set default consent
setDefaultConsentState({
  'analytics_storage': data.analytical,
  'ad_storage': data.marketing,
  'ad_user_data': data.marketing,
  'ad_personalization':data.marketing,
  'personalization_storage': data.marketing,
  'functionality_storage': 'granted',
  'security_storage': 'granted',
  'wait_for_update': makeNumber(data.wait_for_update)
});
var config = {
    apiKey: data.apiKey,
    product: data.product,
    necessaryCookies: data.necessaryCookies ? data.necessaryCookies.split(',').map(cookie => cookie.trim()) : [],
    optionalCookies: [
        {
            name : 'Analytics',
            label: 'Analytical Cookies',
            description: 'Analytical cookies help us to improve our website by collecting and reporting information on its usage.',
            cookies: data.anaylticsCookies,
            onAccept : function(){
                updateConsentState({
                'analytics_storage': 'granted'
                });
                dataLayerPush({
                  'event': 'analytics_accept',
                  'category': 'analytics'
                });
            },
            onRevoke: function(){
                updateConsentState({
                'analytics_storage': 'denied'
                });
                dataLayerPush({
                  'event': 'analytics_revoke',
                  'category': 'analytics'
                });
            },
            vendors: data.analytics-vendors
        },
        {
            name : 'marketing',
            label: 'Marketing Cookies',
            description: 'We use marketing cookies to help us improve the relevancy of suggested content and advertising campaigns.',
            cookies: data.marketingCookies,
            onAccept : function(){
                updateConsentState({
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'personalization_storage': 'granted'
                });
                dataLayerPush({
                  'event': 'marketing_accept',
                  'category': 'marketing'
                });
            },
            onRevoke: function(){
                updateConsentState({
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'personalization_storage': 'denied'
                });
                dataLayerPush({
                  'event': 'marketing_revoke',
                  'category': 'marketing'
                });
            },
            vendors: data.marketingVendors
        }
    ],
    position: data.position || 'right',
    theme: data.theme || 'dark',
    toggleType: data.toggleType || 'slider',
    rejectButton: data.rejectButton || true,
    notifyOnce: data.notifyOnce || true,
    branding: {
        fontFamily: data.fontFamily,
        fontColor: data.fontColor ,
        backgroundColor: data.backgroundColor
    }

};
const onSuccess = () => {
    const CookieControl = copyFromWindow('CookieControl');
    log(config);
    CookieControl.load(config);
    data.gtmOnSuccess();
  };
const onFailure = () => {
    log("fail");
    data.gtmOnFailure();
  };
injectScript('https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js', onSuccess, onFailure);
