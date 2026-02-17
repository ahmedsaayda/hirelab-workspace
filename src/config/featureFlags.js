/**
 * Central feature flags for the application.
 * Set a flag to `true` to enable a feature for ALL users,
 * or `false` to restrict it (e.g. admin-only or hidden).
 */

const featureFlags = {
  /**
   * When `false`, Template 2 is only available to admin users.
   * Set to `true` to make it available for everyone.
   */
  TEMPLATE_2_PUBLIC: false,
};

export default featureFlags;

