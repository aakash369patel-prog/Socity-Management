<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PaymentMethod;
use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Invoice;
use App\Models\Payment;
use App\Services\AccountingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Response;

class PaymentController extends Controller
{
    use ResolvesSocietyContext;

    public function __construct(private readonly AccountingService $accounting)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $query = Payment::query()
            ->with(['invoice', 'unit'])
            ->where('society_id', $societyId)
            ->orderByDesc('paid_at')
            ->orderByDesc('created_at');

        if ($user->hasRole(UserRole::Resident)) {
            $unitIds = $user->units()->pluck('units.id');
            $query->whereIn('unit_id', $unitIds);
        }

        if ($request->filled('invoice_id')) {
            $query->where('invoice_id', $request->integer('invoice_id'));
        }

        return PaymentResource::collection($query->paginate(20));
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);
        $validated = $request->validated();

        $invoice = Invoice::query()->whereKey($validated['invoice_id'])->first();

        if (! $invoice || (int) $invoice->society_id !== $societyId) {
            return response()->json(['message' => 'Invoice not found.'], Response::HTTP_NOT_FOUND);
        }

        try {
            $payment = $this->accounting->recordPayment(
                $invoice,
                $user,
                (float) $validated['amount'],
                PaymentMethod::from($validated['method']),
                $validated['gateway_ref'] ?? null,
                $validated['notes'] ?? null,
            );
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return (new PaymentResource($payment))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
