<?php

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class CertificateResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'issuer' => $this->issuer,
            'issued_date' => $this->issued_date,
            'file' => $this->file,
            'description' => $this->description,
            'expiry_date' => $this->expiry_date,
            'credential_url' => $this->credential_url,
        ];
    }
}
