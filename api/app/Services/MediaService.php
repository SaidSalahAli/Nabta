<?php

namespace Nabta\Services;

use Nabta\Models\Media;
use Nabta\Helpers;

/**
 * Media Service
 */
class MediaService
{
    private Media $mediaModel;
    private string $uploadPath;
    private int $maxFileSize;
    private array $allowedImageTypes;
    private array $allowedDocumentTypes;

    public function __construct()
    {
        $this->mediaModel = new Media();
        $this->uploadPath = Helpers\getUploadsPath();
        $this->maxFileSize = (int)getenv('FILE_MAX_SIZE') ?: 52428800; // 50MB
        $this->allowedImageTypes = explode(',', getenv('ALLOWED_IMAGE_TYPES') ?: 'jpg,jpeg,png,gif,webp');
        $this->allowedDocumentTypes = explode(',', getenv('ALLOWED_PDF_TYPES') ?: 'pdf');
    }

    /**
     * Upload media file
     */
    public function upload(array $file, int $userId): array
    {
        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return [
                'success' => false,
                'message' => 'File upload failed',
                'data' => null
            ];
        }

        // Check file size
        if ($file['size'] > $this->maxFileSize) {
            return [
                'success' => false,
                'message' => 'File size exceeds maximum limit',
                'data' => null
            ];
        }

        // Get file extension
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        // Determine file type and validate
        $fileType = $this->getFileType($ext, $file['type']);
        if (!$fileType) {
            return [
                'success' => false,
                'message' => 'File type not allowed',
                'data' => null
            ];
        }

        // Create unique filename
        $filename = Helpers\generateToken() . '.' . $ext;
        $uploadDir = $this->uploadPath . '/' . $fileType;
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filepath = $uploadDir . '/' . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            return [
                'success' => false,
                'message' => 'Failed to save file',
                'data' => null
            ];
        }

        // Get image dimensions if applicable
        $width = null;
        $height = null;
        if ($fileType === 'image') {
            $imageInfo = getimagesize($filepath);
            if ($imageInfo) {
                $width = $imageInfo[0];
                $height = $imageInfo[1];
            }
        }

        // Store in database
        $mediaData = [
            'user_id' => $userId,
            'file_name' => $file['name'],
            'file_path' => '/public/uploads/' . $fileType . '/' . $filename,
            'mime_type' => $file['type'],
            'file_size' => $file['size'],
            'file_type' => $fileType,
            'width' => $width,
            'height' => $height,
            'created_at' => Helpers\getCurrentTimestamp()
        ];

        $mediaId = $this->mediaModel->create($mediaData);

        if (!$mediaId) {
            unlink($filepath); // Delete uploaded file if DB save fails
            return [
                'success' => false,
                'message' => 'Failed to save media information',
                'data' => null
            ];
        }

        $media = $this->mediaModel->find($mediaId);

        return [
            'success' => true,
            'message' => 'Media uploaded successfully',
            'data' => $media
        ];
    }

    /**
     * Get file type
     */
    private function getFileType(string $ext, string $mimeType): ?string
    {
        if (in_array($ext, $this->allowedImageTypes)) {
            return 'image';
        }

        if (in_array($ext, $this->allowedDocumentTypes)) {
            return 'document';
        }

        // Check by mime type
        if (strpos($mimeType, 'image/') === 0) {
            return 'image';
        }

        if (strpos($mimeType, 'video/') === 0) {
            return 'video';
        }

        if ($mimeType === 'application/pdf') {
            return 'document';
        }

        return null;
    }

    /**
     * Get media by ID
     */
    public function getById(int $mediaId): ?array
    {
        return $this->mediaModel->find($mediaId);
    }

    /**
     * Delete media
     */
    public function delete(int $mediaId, int $userId): array
    {
        $media = $this->mediaModel->find($mediaId);

        if (!$media) {
            return [
                'success' => false,
                'message' => 'Media not found',
                'data' => null
            ];
        }

        // Check ownership or admin status
        if ($media['user_id'] !== $userId) {
            // TODO: Check if user is admin
        }

        // Delete file
        $filepath = Helpers\getProjectRoot() . $media['file_path'];
        if (file_exists($filepath)) {
            unlink($filepath);
        }

        // Delete from database
        if ($this->mediaModel->delete($mediaId)) {
            return [
                'success' => true,
                'message' => 'Media deleted successfully'
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to delete media',
            'data' => null
        ];
    }
}
