/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OfflineStorage,
  OFFLINE_STAFF_SEEDS,
  DEFAULT_CUSTOMERS,
  DEFAULT_BUSINESS,
  DEFAULT_BRANCH,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_PROMOTIONS,
  INITIAL_INVENTORY
} from "./OfflineStorage";

export const OfflineProvider = {
  initializeOfflineState(): void {
    if (typeof window === "undefined") return;

    // Ensure staff seeds are initialized in OfflineStorage
    if (!OfflineStorage.getItem("carss_staff")) {
      OfflineStorage.setJson("carss_staff", OFFLINE_STAFF_SEEDS || []);
    }

    // Ensure customer profiles are initialized
    if (!OfflineStorage.getItem("carss_customers")) {
      OfflineStorage.setJson("carss_customers", DEFAULT_CUSTOMERS || []);
    }

    // Ensure businesses are initialized
    if (!OfflineStorage.getItem("carss_businesses")) {
      OfflineStorage.setJson("carss_businesses", DEFAULT_BUSINESS ? [DEFAULT_BUSINESS] : []);
    }

    // Ensure branches are initialized
    if (!OfflineStorage.getItem("carss_branches")) {
      OfflineStorage.setJson("carss_branches", DEFAULT_BRANCH ? [DEFAULT_BRANCH] : []);
    }

    // Ensure categories are initialized
    if (!OfflineStorage.getItem("carss_categories")) {
      OfflineStorage.setJson("carss_categories", INITIAL_CATEGORIES || []);
    }

    // Ensure menu items are initialized
    if (!OfflineStorage.getItem("carss_items")) {
      OfflineStorage.setJson("carss_items", INITIAL_MENU_ITEMS || []);
    }

    // Ensure promotions are initialized
    if (!OfflineStorage.getItem("carss_promotions")) {
      OfflineStorage.setJson("carss_promotions", INITIAL_PROMOTIONS || []);
    }

    // Ensure inventory is initialized
    if (!OfflineStorage.getItem("carss_inventory")) {
      OfflineStorage.setJson("carss_inventory", INITIAL_INVENTORY || []);
    }
  }
};
