<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Society\StoreSocietyRequest;
use App\Http\Requests\Society\UpdateSocietyRequest;
use App\Http\Resources\SocietyResource;
use App\Models\Society;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class SocietyController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $societies = Society::query()
            ->withCount(['units', 'users'])
            ->orderBy('name')
            ->get();

        return SocietyResource::collection($societies);
    }

    public function store(StoreSocietyRequest $request): JsonResponse
    {
        $society = Society::query()->create($request->validated());

        return (new SocietyResource($society))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Society $society): SocietyResource
    {
        $society->loadCount(['units', 'users']);

        return new SocietyResource($society);
    }

    public function update(UpdateSocietyRequest $request, Society $society): SocietyResource
    {
        $society->fill($request->validated())->save();
        $society->loadCount(['units', 'users']);

        return new SocietyResource($society);
    }

    public function destroy(Society $society): JsonResponse
    {
        $society->delete();

        return response()->json(['message' => 'Society archived.']);
    }
}
