// This file is included from all apify.com web properties (blog, web, console, ...) to let us see
// where the visitors are coming from. This used to be in Google Tag Manger,
// but it was blocked by ad blockers, hence hosting this here.
// Include it this way:
//  <script async src="https://apify.com/ext/bootstrap.js"></script>
{
    function escapeCookie(val) {
        return (val || '').replace(/;/g, '');
    }

    const ACQUISITION_SOURCE = 'ApifyAcqSrc';
    const ACQUISITION_REFERRER_FIRST = 'ApifyAcqRefFirst';
    const SIGNUP_COUPON_ID_COOKIE_NAME = 'ApifySignupCouponId';
    // https://docs.apify.com/legal/affiliate-program-terms-and-conditions
    const MAX_AGE_SECS = 45 * 24 * 60 * 60; // 45 days, based on terms and conditions

    if (!document.cookie.includes(ACQUISITION_SOURCE)) {
        document.cookie = `${ACQUISITION_SOURCE}=${escapeCookie(window.location.href)}; Max-Age=${MAX_AGE_SECS}; Path=/; Domain=apify.com`;

        if (document.referrer) {
            document.cookie = `${ACQUISITION_REFERRER_FIRST}=${escapeCookie(document.referrer)}; Max-Age=${MAX_AGE_SECS}; Path=/; Domain=apify.com`;
        }

        const params = new URLSearchParams(window.location.search);
        const couponId = params.get('couponId'); // This should ideally to be consistent with apify-core

        if (couponId) {
            document.cookie = `${SIGNUP_COUPON_ID_COOKIE_NAME}=${encodeURIComponent(couponId)}; Max-Age=${MAX_AGE_SECS}; Path=/; Domain=apify.com`;
        }
    }
}
