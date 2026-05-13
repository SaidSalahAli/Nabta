-- Nabta Educational Platform Database Schema
-- Version 1.0.0
-- Created: 2026-05-13

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS `roles` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `permissions` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `module` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `role_permissions` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `role_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_role_permission` (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20),
    `country` VARCHAR(100),
    `city` VARCHAR(100),
    `avatar_url` VARCHAR(500),
    `bio` TEXT,
    `is_verified` BOOLEAN DEFAULT FALSE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_login_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_roles` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_user_role` (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_sessions` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `token` VARCHAR(500) NOT NULL UNIQUE,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `expires_at` TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `login_logs` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT,
    `email` VARCHAR(255),
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `status` ENUM('success', 'failed') DEFAULT 'failed',
    `reason` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_email` (`email`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT,
    `module` VARCHAR(100),
    `action` VARCHAR(100),
    `table_name` VARCHAR(100),
    `record_id` INT,
    `old_values` JSON,
    `new_values` JSON,
    `ip_address` VARCHAR(45),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_module` (`module`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CATEGORIES & TAXONOMIES
-- ============================================================

CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `type` ENUM('episodes', 'applications', 'worksheets') NOT NULL,
    `name_ar` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description_ar` TEXT,
    `description_en` TEXT,
    `icon_url` VARCHAR(500),
    `color_code` VARCHAR(7),
    `display_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_slug_type` (`slug`, `type`),
    INDEX `idx_type` (`type`),
    INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tags` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name_ar` VARCHAR(100) NOT NULL,
    `name_en` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- EPISODES & SERIES
-- ============================================================

CREATE TABLE IF NOT EXISTS `episode_series` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title_ar` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `description_ar` TEXT,
    `description_en` TEXT,
    `thumbnail_url` VARCHAR(500),
    `episodes_count` INT DEFAULT 0,
    `is_published` BOOLEAN DEFAULT FALSE,
    `published_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_is_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `episodes` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `series_id` INT,
    `title_ar` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `short_description_ar` VARCHAR(500),
    `short_description_en` VARCHAR(500),
    `description_ar` TEXT,
    `description_en` TEXT,
    `thumbnail_url` VARCHAR(500),
    `youtube_url` VARCHAR(500) NOT NULL,
    `author` VARCHAR(255),
    `duration_seconds` INT,
    `views_count` INT DEFAULT 0,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `is_published` BOOLEAN DEFAULT FALSE,
    `published_at` TIMESTAMP NULL,
    `seo_title` VARCHAR(255),
    `seo_description` VARCHAR(500),
    `seo_keywords` VARCHAR(500),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`series_id`) REFERENCES `episode_series`(`id`) ON DELETE SET NULL,
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_series_id` (`series_id`),
    INDEX `idx_slug` (`slug`),
    INDEX `idx_is_published` (`is_published`),
    INDEX `idx_is_featured` (`is_featured`),
    FULLTEXT INDEX `ft_search` (`title_ar`, `title_en`, `description_ar`, `description_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `series_episodes` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `series_id` INT NOT NULL,
    `episode_id` INT NOT NULL,
    `order` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`series_id`) REFERENCES `episode_series`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_series_episode` (`series_id`, `episode_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `episode_tags` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `episode_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_episode_tag` (`episode_id`, `tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- APPLICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS `applications` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `title_ar` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `description_ar` TEXT,
    `description_en` TEXT,
    `full_content_ar` LONGTEXT,
    `full_content_en` LONGTEXT,
    `icon_url` VARCHAR(500),
    `google_play_url` VARCHAR(500),
    `app_store_url` VARCHAR(500),
    `website_url` VARCHAR(500),
    `version` VARCHAR(20),
    `downloads_count` INT DEFAULT 0,
    `rating` DECIMAL(3, 2) DEFAULT 0,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `is_published` BOOLEAN DEFAULT FALSE,
    `published_at` TIMESTAMP NULL,
    `seo_title` VARCHAR(255),
    `seo_description` VARCHAR(500),
    `seo_keywords` VARCHAR(500),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_slug` (`slug`),
    INDEX `idx_is_published` (`is_published`),
    FULLTEXT INDEX `ft_search` (`title_ar`, `title_en`, `description_ar`, `description_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `application_gallery` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `application_id` INT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `alt_text` VARCHAR(255),
    `position` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE,
    INDEX `idx_application_id` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `app_tags` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `application_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_app_tag` (`application_id`, `tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- WORKSHEETS
-- ============================================================

CREATE TABLE IF NOT EXISTS `worksheets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `title_ar` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `description_ar` TEXT,
    `description_en` TEXT,
    `thumbnail_url` VARCHAR(500),
    `pdf_url` VARCHAR(500) NOT NULL,
    `grade_level` VARCHAR(50),
    `subject` VARCHAR(100),
    `downloads_count` INT DEFAULT 0,
    `is_free` BOOLEAN DEFAULT TRUE,
    `is_printable` BOOLEAN DEFAULT TRUE,
    `is_published` BOOLEAN DEFAULT FALSE,
    `published_at` TIMESTAMP NULL,
    `seo_title` VARCHAR(255),
    `seo_description` VARCHAR(500),
    `seo_keywords` VARCHAR(500),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_slug` (`slug`),
    INDEX `idx_is_published` (`is_published`),
    INDEX `idx_grade_level` (`grade_level`),
    FULLTEXT INDEX `ft_search` (`title_ar`, `title_en`, `description_ar`, `description_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `worksheet_tags` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `worksheet_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`worksheet_id`) REFERENCES `worksheets`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_worksheet_tag` (`worksheet_id`, `tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `worksheet_download_logs` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `worksheet_id` INT NOT NULL,
    `user_id` INT,
    `downloaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`worksheet_id`) REFERENCES `worksheets`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_worksheet_id` (`worksheet_id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_downloaded_at` (`downloaded_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MEDIA & FILES
-- ============================================================

CREATE TABLE IF NOT EXISTS `media` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT,
    `file_name` VARCHAR(500) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL UNIQUE,
    `mime_type` VARCHAR(100),
    `file_size` INT,
    `file_type` ENUM('image', 'document', 'video', 'other') DEFAULT 'other',
    `width` INT,
    `height` INT,
    `duration` INT,
    `alt_text` VARCHAR(500),
    `description` TEXT,
    `is_public` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_file_type` (`file_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEO & CONTENT
-- ============================================================

CREATE TABLE IF NOT EXISTS `seo_pages` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `meta_description` VARCHAR(500),
    `meta_keywords` VARCHAR(500),
    `og_image` VARCHAR(500),
    `canonical_url` VARCHAR(500),
    `is_index` BOOLEAN DEFAULT TRUE,
    `is_follow` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `banners` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title_ar` VARCHAR(255),
    `title_en` VARCHAR(255),
    `image_url` VARCHAR(500) NOT NULL,
    `link_url` VARCHAR(500),
    `position` ENUM('top', 'middle', 'bottom') DEFAULT 'top',
    `display_order` INT DEFAULT 0,
    `start_date` DATE,
    `end_date` DATE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `homepage_sections` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `title_ar` VARCHAR(255),
    `title_en` VARCHAR(255),
    `description_ar` TEXT,
    `description_en` TEXT,
    `content_type` ENUM('episodes', 'applications', 'worksheets', 'html', 'custom'),
    `display_order` INT DEFAULT 0,
    `is_visible` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `settings` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL UNIQUE,
    `value` LONGTEXT,
    `type` ENUM('string', 'json', 'boolean', 'number') DEFAULT 'string',
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CONTACT & ENGAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20),
    `subject` VARCHAR(255),
    `message` TEXT NOT NULL,
    `status` ENUM('new', 'read', 'replied', 'resolved') DEFAULT 'new',
    `reply_message` TEXT,
    `replied_at` TIMESTAMP NULL,
    `replied_by` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`replied_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_email` (`email`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `name` VARCHAR(255),
    `is_subscribed` BOOLEAN DEFAULT TRUE,
    `verification_token` VARCHAR(255),
    `verified_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`),
    INDEX `idx_is_subscribed` (`is_subscribed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SITE INFO
-- ============================================================

CREATE TABLE IF NOT EXISTS `social_links` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `platform` VARCHAR(50) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `icon_url` VARCHAR(500),
    `display_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sponsors` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `logo_url` VARCHAR(500),
    `website_url` VARCHAR(500),
    `description` TEXT,
    `display_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `team_members` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `position_ar` VARCHAR(255),
    `position_en` VARCHAR(255),
    `bio_ar` TEXT,
    `bio_en` TEXT,
    `image_url` VARCHAR(500),
    `email` VARCHAR(255),
    `phone` VARCHAR(20),
    `display_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `faq` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `question_ar` VARCHAR(500) NOT NULL,
    `question_en` VARCHAR(500) NOT NULL,
    `answer_ar` TEXT NOT NULL,
    `answer_en` TEXT NOT NULL,
    `category` VARCHAR(100),
    `display_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `donations` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT,
    `name` VARCHAR(255),
    `email` VARCHAR(255),
    `amount` DECIMAL(10, 2) NOT NULL,
    `message` TEXT,
    `payment_method` VARCHAR(50),
    `transaction_id` VARCHAR(255),
    `status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEEDS & DEFAULT DATA
-- ============================================================

INSERT INTO `roles` (`name`, `description`) VALUES
('Super Admin', 'Full system access'),
('Admin', 'Admin panel access with full content management'),
('Content Manager', 'Can manage episodes, applications, and worksheets'),
('Editor', 'Can edit content but cannot publish'),
('User', 'Regular user account');

INSERT INTO `permissions` (`name`, `module`, `description`) VALUES
('view_dashboard', 'dashboard', 'View admin dashboard'),
('manage_users', 'users', 'Manage user accounts'),
('manage_roles', 'roles', 'Manage roles and permissions'),
('manage_episodes', 'episodes', 'Create, edit, delete episodes'),
('manage_applications', 'applications', 'Create, edit, delete applications'),
('manage_worksheets', 'worksheets', 'Create, edit, delete worksheets'),
('manage_categories', 'categories', 'Manage categories'),
('manage_settings', 'settings', 'Manage system settings'),
('view_analytics', 'analytics', 'View analytics and reports'),
('manage_media', 'media', 'Manage media files');

-- Add all permissions to Super Admin
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, `id` FROM `permissions`;

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- These are already created in the table definitions above
-- but we can add additional composite indexes if needed

ALTER TABLE `episodes` ADD INDEX `idx_category_published` (`category_id`, `is_published`);
ALTER TABLE `applications` ADD INDEX `idx_category_published` (`category_id`, `is_published`);
ALTER TABLE `worksheets` ADD INDEX `idx_category_published` (`category_id`, `is_published`);
ALTER TABLE `user_sessions` ADD INDEX `idx_user_expires` (`user_id`, `expires_at`);
ALTER TABLE `login_logs` ADD INDEX `idx_email_created` (`email`, `created_at`);
