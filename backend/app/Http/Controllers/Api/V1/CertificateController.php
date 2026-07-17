<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\CertificateResource;
use App\Services\CertificateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function __construct(
        protected CertificateService $certificateService
    ) {}

    public function index(): JsonResponse
    {
        return $this->success(
            CertificateResource::collection($this->certificateService->all()),
        );
    }

    public function show(int $id): JsonResponse
    {
        $certificate = $this->certificateService->findById($id);
        if (!$certificate) {
            return $this->notFound('Certificate not found');
        }
        return $this->success(new CertificateResource($certificate));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issued_date' => 'required|date',
            'file' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'expiry_date' => 'nullable|date|after:issued_date',
            'credential_url' => 'nullable|url|max:255',
        ]);

        $certificate = $this->certificateService->create($validated);
        return $this->created(new CertificateResource($certificate), 'Certificate created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'issuer' => 'sometimes|string|max:255',
            'issued_date' => 'sometimes|date',
            'file' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'expiry_date' => 'nullable|date|after:issued_date',
            'credential_url' => 'nullable|url|max:255',
        ]);

        $certificate = $this->certificateService->update($id, $validated);
        return $this->success(new CertificateResource($certificate), 'Certificate updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->certificateService->delete($id);
        return $this->noContent('Certificate deleted');
    }
}
