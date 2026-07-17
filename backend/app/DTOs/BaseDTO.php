<?php

namespace App\DTOs;

use Illuminate\Http\Request;

abstract class BaseDTO
{
    public static function fromRequest(Request $request): static
    {
        $reflection = new \ReflectionClass(static::class);
        $properties = $reflection->getProperties(\ReflectionProperty::IS_PUBLIC);
        $instance = $reflection->newInstanceWithoutConstructor();

        foreach ($properties as $property) {
            $value = $request->input($property->getName());
            if ($value !== null) {
                $type = $property->getType();
                if ($type && !$type->isBuiltin()) {
                    continue;
                }
                settype($value, $type ? $type->getName() : 'string');
                $property->setValue($instance, $value);
            }
        }

        return $instance;
    }

    public function toArray(): array
    {
        $reflection = new \ReflectionClass($this);
        $properties = $reflection->getProperties(\ReflectionProperty::IS_PUBLIC);
        $data = [];

        foreach ($properties as $property) {
            $data[$property->getName()] = $property->getValue($this);
        }

        return $data;
    }
}
