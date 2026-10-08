<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\AccountingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RazorpayWebhookController extends Controller
{
    public function __construct(private readonly AccountingService $accounting)
    {
    }

    /**
     * Stub handler for Razorpay payment.captured events.
     * Set RAZORPAY_WEBHOOK_SECRET in .env to enable signature verification.
     */
    public function handle(Request $request): JsonResponse
    {
        $secret = config('services.razorpay.webhook_secret');

        if ($secret) {
            $signature = $request->header('X-Razorpay-Signature');
            $expected = hash_hmac('sha256', $request->getContent(), $secret);

            if (! hash_equals($expected, (string) $signature)) {
                return response()->json(['message' => 'Invalid signature.'], Response::HTTP_BAD_REQUEST);
            }
        }

        $event = $request->input('event');
        $paymentEntity = $request->input('payload.payment.entity');
        $gatewayRef = is_array($paymentEntity) ? ($paymentEntity['id'] ?? null) : null;

        if ($event === 'payment.captured' && $gatewayRef) {
            $payment = Payment::query()
                ->where('gateway_ref', $gatewayRef)
                ->where('method', PaymentMethod::Razorpay)
                ->first();

            if ($payment && $payment->status === PaymentStatus::Pending) {
                $this->accounting->completeRazorpayPayment($payment);
            }
        }

        return response()->json(['received' => true, 'event' => $event]);
    }
}
