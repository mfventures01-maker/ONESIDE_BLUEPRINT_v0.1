/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BootstrapPayload {
  fullName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface CarssResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * CARSS API Gateway Service
 * Acting as the Single Source of Truth under the CARSS Constitution.
 */
export const carssApi = {
  /**
   * Orchestrate system-level SuperAdmin bootstrap configuration
   */
  async bootstrap(payload: BootstrapPayload): Promise<CarssResult> {
    // Simulate real network/system latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple robust password checks
    if (!payload.fullName || payload.fullName.trim().length < 2) {
      return {
        success: false,
        error: "Full name is too short or invalid.",
      };
    }

    if (!payload.email || !payload.email.includes("@")) {
      return {
        success: false,
        error: "A valid email address is required.",
      };
    }

    if (!payload.password || payload.password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long.",
      };
    }

    return {
      success: true,
      data: {
        user: {
          email: payload.email,
          fullName: payload.fullName,
          role: "superadmin",
        },
      },
    };
  },
};
