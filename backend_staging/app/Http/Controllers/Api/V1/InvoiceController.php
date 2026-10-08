<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\InvoiceStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Concerns\ResolvesSocietyContext;
use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\Unit;
use App\Services\AccountingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    use ResolvesSocietyContext;

    public function __construct(private readonly AccountingService $accounting)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        $query = Invoice::query()
            ->with('unit')
            ->where('society_id', $societyId)
            ->orderByDesc('due_date');

        if ($user->hasRole(UserRole::Resident)) {
            $unitIds = $user->units()->pluck('units.id');
            $query->whereIn('unit_id', $unitIds);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return InvoiceResource::collection($query->paginate(20));
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);
        $validated = $request->validated();

        $unit = Unit::query()
            ->whereKey($validated['unit_id'])
            ->where('society_id', $societyId)
            ->first();

        if (! $unit) {
            return response()->json([
                'message' => 'The selected unit does not belong to this society.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $exists = Invoice::query()
            ->where('society_id', $societyId)
            ->where('invoice_number', $validated['invoice_number'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Invoice number already exists for this society.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $invoice = Invoice::query()->create([
            'society_id' => $societyId,
            'unit_id' => $validated['unit_id'],
            'invoice_number' => $validated['invoice_number'],
            'amount' => $validated['amount'],
            'due_date' => $validated['due_date'],
            'status' => InvoiceStatus::Unpaid,
        ]);

        $this->accounting->postInvoiceCharge($invoice);

        $invoice->load('unit');

        return (new InvoiceResource($invoice))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Request $request, Invoice $invoice): JsonResponse|InvoiceResource
    {
        if (! $this->canAccessInvoice($request, $invoice)) {
            return response()->json(['message' => 'Invoice not found.'], Response::HTTP_NOT_FOUND);
        }

        $invoice->load('unit');

        return new InvoiceResource($invoice);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): JsonResponse|InvoiceResource
    {
        if (! $this->canAccessInvoice($request, $invoice)) {
            return response()->json(['message' => 'Invoice not found.'], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validated();

        if (isset($validated['status']) && $validated['status'] === InvoiceStatus::Paid->value) {
            $invoice->markPaid();
            unset($validated['status']);
        }

        if ($validated !== []) {
            $invoice->fill($validated)->save();
        }

        $invoice->load('unit');

        return new InvoiceResource($invoice);
    }

    private function canAccessInvoice(Request $request, Invoice $invoice): bool
    {
        $user = $request->user();
        $societyId = $this->resolveSocietyId($user, $request);

        if ((int) $invoice->society_id !== $societyId) {
            return false;
        }

        if ($user->hasRole(UserRole::Resident)) {
            return $user->units()->where('units.id', $invoice->unit_id)->exists();
        }

        return true;
    }
}
