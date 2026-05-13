<?php

namespace Nabta\Models;

/**
 * Media Model
 */
class Media extends BaseModel
{
    protected string $table = 'media';
    protected string $primaryKey = 'id';
    protected array $fillable = [
        'user_id',
        'file_name',
        'file_path',
        'mime_type',
        'file_size',
        'file_type',
        'width',
        'height',
        'duration',
        'alt_text',
        'description',
        'is_public',
        'created_at'
    ];
}
