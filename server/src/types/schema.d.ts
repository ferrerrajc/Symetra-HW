/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/store/products": {
    get: {
      parameters: {
        query?: {
          userId?: components["parameters"]["userIdParam"];
        };
      };
      responses: {
        /** @description Products retrieved successfully */
        200: {
          content: {
            "application/json": components["schemas"]["Product"][];
          };
        };
      };
    };
  };
  "/store/coupons": {
    get: {
      parameters: {
        query?: {
          userId?: components["parameters"]["userIdParam"];
        };
      };
      responses: {
        /** @description Coupons retrieved successfully */
        200: {
          content: {
            "application/json": components["schemas"]["Coupon"][];
          };
        };
      };
    };
  };
  "/store/transactions": {
    get: {
      parameters: {
        query?: {
          userId?: components["parameters"]["userIdParam"];
        };
      };
      responses: {
        /** @description Transactions retrieved successfully */
        200: {
          content: {
            "application/json": components["schemas"]["Transaction"][];
          };
        };
      };
    };
  };
  "/admin/users": {
    get: {
      responses: {
        /** @description Users retrieved successfully */
        200: {
          content: {
            "application/json": components["schemas"]["User"][];
          };
        };
      };
    };
  };
  "/admin/coupon": {
    post: {
      requestBody?: {
        content: {
          "application/json": components["schemas"]["Coupon"];
        };
      };
      responses: {
        /** @description Coupon created successfully */
        200: {
          content: {
            "application/json": components["schemas"]["Coupon"];
          };
        };
        /** @description Invalid coupon data */
        400: never;
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    Coupon: {
      /**
       * @description The code customers will enter to redeem this coupon
       * @example BIGDEAL15
       */
      code: string;
      /**
       * @description The number of completed transactions for a customer to be eligible for this coupon
       * @example 10
       */
      afterTransactions: number;
      /**
       * @description The number of times this coupon may be redeemed
       * @example 10
       */
      maxUses: number;
      /**
       * @description The percent that the price will be reduced when redeeming this coupon
       * @example 15
       */
      discountPercent: number;
    };
    Product: {
      id: string;
      /** @example Hat */
      name: string;
      price: number;
    };
    User: {
      id: string;
      /** @example Alice */
      name: string;
    };
    Transaction: {
      id: string;
      userId: string;
      productIds: string[];
      couponCodes: string[];
    };
  };
  responses: never;
  parameters: {
    /** @description Simulated logged in user */
    userIdParam?: string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;
