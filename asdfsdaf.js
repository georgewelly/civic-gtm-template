var config = {
    apiKey: data.apiKey,
    product: data.product,
    optionalCookies: [
        {
            name : 'Analytics',
            label: 'Analytical Cookies',
            description: 'Analytical cookies help us to improve our website by collecting and reporting information on its usage.',
            cookies: ['_ga', '_ga*', '_gid', '_gat', '__utma', '__utmt', '__utmb', '__utmc', '__utmz', '__utmv'],
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
            vendors: [
              {
                name: 'Google',
                description: 'Google Analytics is used to track website performance and user behaviour to better understand how users interact with our content.',
                url: 'https://business.safety.google/privacy/'
              }
            ]
        },
        {
            name : 'marketing',
            label: 'Marketing Cookies',
            description: 'We use marketing cookies to help us improve the relevancy of suggested content and advertising campaigns.',
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
            vendors: [
              {
                name: 'Google',
                description: 'Google Marketing Products help deliver personalised advertising and relevant content based on your browsing habits and preferences.',
                url: 'https://business.safety.google/privacy/'
              }
            ]
        }
    ]
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