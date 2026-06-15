import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createStripeClient, getStripeErrorMessage, type StripeEnv } from "@/lib/stripe.server";

type EnsureCouponResult =
  | { ok: true; couponId: string; promotionCode: string; created: boolean }
  | { ok: false; error: string };

async function ensureAdmin(userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("forbidden");
}

const COUPON_ID = "acordos10_90d";
const PROMO_CODE = "ACORDOS10";
const PERCENT_OFF = 10;
const MAX_REDEMPTIONS = 200;
const DAYS_VALID = 90;

/**
 * Cria (idempotente) o cupom ACORDOS10:
 * - 10% de desconto único (duration: "once")
 * - Expira em 90 dias (redeem_by)
 * - Até 200 resgates (max_redemptions)
 */
export const ensureAcordos10Coupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { env: StripeEnv }) => {
    if (input.env !== "sandbox" && input.env !== "live") {
      throw new Error("Invalid env");
    }
    return input;
  })
  .handler(async ({ data, context }): Promise<EnsureCouponResult> => {
    await ensureAdmin(context.userId);
    const stripe = createStripeClient(data.env);

    try {
      let created = false;

      // 1) Coupon
      try {
        await stripe.coupons.retrieve(COUPON_ID);
      } catch (e: unknown) {
        const code = (e as { code?: string; statusCode?: number })?.code;
        const status = (e as { statusCode?: number })?.statusCode;
        if (code === "resource_missing" || status === 404) {
          const redeemBy = Math.floor(Date.now() / 1000) + DAYS_VALID * 24 * 60 * 60;
          await stripe.coupons.create({
            id: COUPON_ID,
            name: PROMO_CODE,
            percent_off: PERCENT_OFF,
            duration: "once",
            max_redemptions: MAX_REDEMPTIONS,
            redeem_by: redeemBy,
          });
          created = true;
        } else {
          throw e;
        }
      }

      // 2) Promotion code (texto digitável)
      const existing = await stripe.promotionCodes.list({
        code: PROMO_CODE,
        limit: 1,
      });
      if (!existing.data.length) {
        await stripe.promotionCodes.create({
          promotion: { type: "coupon", coupon: COUPON_ID },
          code: PROMO_CODE,
          active: true,
        });
        created = true;
      }

      return { ok: true, couponId: COUPON_ID, promotionCode: PROMO_CODE, created };
    } catch (error) {
      console.error("[admin-coupons] erro", error);
      return { ok: false, error: getStripeErrorMessage(error) };
    }
  });
