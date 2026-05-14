-- ============================================================
-- MIGRATION: Update episodes table
-- Version: 1.1.0
-- Date: 2026-05-14
-- Description: Add cover_image, video_url, video_type,
--              episode_number, transcript, sort_order, has_worksheets
-- ============================================================
-- HOW TO USE:
--   1. Open phpMyAdmin
--   2. Select the "nabta" database
--   3. Click "SQL" tab
--   4. Paste this file and click "Go"
-- ============================================================

ALTER TABLE `episodes`
    -- رقم الحلقة
    ADD COLUMN `episode_number` INT DEFAULT NULL AFTER `series_id`,

    -- نص/ترانسكريبت الحلقة
    ADD COLUMN `transcript_ar` LONGTEXT AFTER `description_en`,
    ADD COLUMN `transcript_en` LONGTEXT AFTER `transcript_ar`,

    -- صورة الغلاف (مطلوبة) + الصورة المصغرة
    ADD COLUMN `cover_image` VARCHAR(500) AFTER `transcript_en`,
    ADD COLUMN `thumbnail_image` VARCHAR(500) AFTER `cover_image`,

    -- رابط الفيديو ونوعه (بدل youtube_url القديم)
    ADD COLUMN `video_url` VARCHAR(500) NOT NULL DEFAULT '' AFTER `thumbnail_image`,
    ADD COLUMN `video_type` ENUM('youtube', 'vimeo', 'mp4', 'stream') DEFAULT 'youtube' AFTER `video_url`,

    -- ترتيب العرض
    ADD COLUMN `sort_order` INT DEFAULT 0 AFTER `duration_seconds`,

    -- هل يوجد أوراق عمل مرتبطة
    ADD COLUMN `has_worksheets` BOOLEAN DEFAULT FALSE AFTER `views_count`,

    -- فهرس للترتيب
    ADD INDEX `idx_sort_order` (`sort_order`);

-- ============================================================
-- نقل البيانات القديمة (إذا كان فيه بيانات موجودة)
-- ============================================================

-- نسخ youtube_url القديم إلى video_url الجديد
UPDATE `episodes`
SET `video_url` = `youtube_url`,
    `video_type` = 'youtube'
WHERE `video_url` = '' AND `youtube_url` IS NOT NULL AND `youtube_url` != '';

-- نسخ thumbnail_url القديم إلى thumbnail_image الجديد
UPDATE `episodes`
SET `thumbnail_image` = `thumbnail_url`
WHERE `thumbnail_image` IS NULL AND `thumbnail_url` IS NOT NULL AND `thumbnail_url` != '';

-- ============================================================
-- (اختياري) حذف الأعمدة القديمة بعد التأكد من نجاح النقل
-- ============================================================

-- ALTER TABLE `episodes`
--     DROP COLUMN `youtube_url`,
--     DROP COLUMN `thumbnail_url`;
