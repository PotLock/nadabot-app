export const Routes = {
  HOME: "/",
  HOME_WITH_FILTERED_CHECKS: (
    filterType: "newly-created" | "active" | "deactivated" | "flagged",
  ) => `/?filterType=${filterType}`,
  ADD_STAMP: "/add-stamp",
  ACCOUNT_INFO: (accountId: string) => `/account-info?accountId=${accountId}`,
};
