# 🎬 Nabta Platform - Visual Flow Diagrams

## Episode Creation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER DASHBOARD                           │
│                  /dashboard/episodes                        │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Click "Add Episode" Button
             ▼
┌─────────────────────────────────────────────────────────────┐
│              EPISODE CREATION PAGE                          │
│         /dashboard/episodes/create                          │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  EpisodeForm Component                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ □ Title (Arabic) *        [________________]         │ │
│  │ □ Category *              [Dropdown ▼]              │ │
│  │ □ Episode Number *        [________]                │ │
│  │ □ Short Description *     [________________]         │ │
│  │ □ Full Description *      [________________]         │ │
│  │ □ Video URL *             [________________]         │ │
│  │ □ Video Type *            [YouTube ▼]              │ │
│  │ □ Duration (seconds) *    [________]                │ │
│  │ □ Thumbnail Image         [________________]         │ │
│  │ □ Cover Image             [________________]         │ │
│  │ □ Transcript              [________________]         │ │
│  │ □ Is Published            [☐]                       │ │
│  │ □ Is Featured             [☐]                       │ │
│  │ □ Has Worksheets          [☐]                       │ │
│  │                                                      │ │
│  │        [Cancel]              [Save]                 │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Form Validation (Client-side)
             │
             ├─ Error ──────────────────┐
             │                          │
             │                   Show Error Message
             │                   Re-enable form
             │
             └─ Valid ─────────────────┐
                                       │
                                       ▼
                    ┌─────────────────────────────────┐
                    │  API Request                    │
                    │  POST /api/v1/admin/episodes    │
                    │                                 │
                    │  Headers:                       │
                    │  - Authorization: Bearer TOKEN  │
                    │  - Content-Type: application/json│
                    │                                 │
                    │  Body: {                        │
                    │    title_ar: "...",            │
                    │    category_id: 1,             │
                    │    episode_number: 1,          │
                    │    short_description_ar: "...",│
                    │    description_ar: "...",      │
                    │    video_url: "...",           │
                    │    video_type: "youtube",      │
                    │    duration_seconds: 3600,     │
                    │    is_published: true,         │
                    │    ...                         │
                    │  }                             │
                    └──────────────┬──────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────────┐
                    │  PHP Backend                     │
                    │  EpisodeController::create()     │
                    │                                  │
                    │  ✓ Validate User (JWT)          │
                    │  ✓ Validate Data                 │
                    │  ✓ Generate Slug                 │
                    │  ✓ Save to Database              │
                    └──────────────┬───────────────────┘
                                   │
                                   ├─ Error ────────────────┐
                                   │                        │
                                   │        Return Error Response
                                   │        (400 Bad Request)
                                   │
                                   └─ Success ─────────────┐
                                                          │
                                                          ▼
                                        ┌──────────────────────────────┐
                                        │  Success Response (201)       │
                                        │  {                           │
                                        │    success: true,            │
                                        │    message: "Created",       │
                                        │    data: { id: 1, ... }      │
                                        │  }                           │
                                        └──────────────┬───────────────┘
                                                       │
                                                       ▼
                                        ┌──────────────────────────────┐
                                        │  Display Success Snackbar    │
                                        │  "تم إنشاء الحلقة بنجاح"     │
                                        │                              │
                                        │  After 1.5 seconds:          │
                                        │  Navigate to /dashboard/     │
                                        │  episodes (list page)        │
                                        └──────────────────────────────┘
```

---

## Category Creation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER DASHBOARD                           │
│             /dashboard/episode-categories                   │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Click "Add Category" Button
             ▼
┌─────────────────────────────────────────────────────────────┐
│              CATEGORY CREATION DIALOG                       │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CategoryForm Component                              │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Type *                    [Episodes ▼]              │ │
│  │ Name (Arabic) *           [________________]         │ │
│  │ Name (English)            [________________]         │ │
│  │ Description (Arabic)      [________________]         │ │
│  │ Description (English)     [________________]         │ │
│  │ Slug                      [________________]         │ │
│  │ Image URL                 [________________]         │ │
│  │                                                      │ │
│  │        [Cancel]              [Save]                 │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Form Validation
             │
             ├─ Error ──────────────────┐
             │                          │
             │                   Show Error Message
             │
             └─ Valid ─────────────────┐
                                       │
                                       ▼
                    ┌─────────────────────────────────┐
                    │  API Request                    │
                    │  POST /api/v1/admin/categories  │
                    │                                 │
                    │  Body: {                        │
                    │    type: "episodes",            │
                    │    name_ar: "...",              │
                    │    name_en: "...",              │
                    │    description_ar: "...",       │
                    │    description_en: "...",       │
                    │    slug: "...",                 │
                    │    image: "..."                 │
                    │  }                              │
                    └──────────────┬──────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────────┐
                    │  PHP Backend                     │
                    │  CategoryController::store()     │
                    │                                  │
                    │  ✓ Validate User (JWT)          │
                    │  ✓ Validate Type                 │
                    │  ✓ Check Slug Uniqueness         │
                    │  ✓ Save to Database              │
                    └──────────────┬───────────────────┘
                                   │
                                   ├─ Error ────────────────┐
                                   │                        │
                                   │   Return Error Response
                                   │
                                   └─ Success ─────────────┐
                                                          │
                                                          ▼
                                        ┌──────────────────────────────┐
                                        │  Success Response (201)       │
                                        │  Close Dialog                 │
                                        │  Refresh Categories List      │
                                        │  Show Success Snackbar        │
                                        └──────────────────────────────┘
```

---

## Data Flow Architecture

```
┌──────────────────────┐
│   REACT FRONTEND     │
│   (Vite + Material)  │
└──────────┬───────────┘
           │
           │ axios (with JWT)
           │
       ┌───▼────────────────────────────┐
       │   API SERVICE LAYER            │
       │ src/api/episodes.js            │
       │ src/api/episodeCategories.js   │
       └───┬────────────────────────────┘
           │
           │ HTTP REST Calls
           │
       ┌───▼────────────────────────────────┐
       │   PHP BACKEND API                  │
       │   /api/v1/admin/episodes           │
       │   /api/v1/admin/categories         │
       └───┬────────────────────────────────┘
           │
           │ Controller → Service → Model
           │
       ┌───▼────────────────────────────────┐
       │   MYSQL DATABASE                   │
       │   episodes table                   │
       │   categories table                 │
       └────────────────────────────────────┘
```

---

## Episode Fields Dependency

```
┌─────────────────────────────────┐
│   REQUIRED FIELDS               │
│  ┌──────────────────────────────┐
│  │ title_ar (TEXT)              │ ──► Generates Slug
│  │ category_id (FK)             │ ──► Links Category
│  │ episode_number (INT)         │ ──► Display Order
│  │ short_description_ar (TEXT)  │
│  │ description_ar (TEXT)        │
│  │ video_url (URL)              │ ──► Embedded in Page
│  │ video_type (ENUM)            │ ──► Player Type
│  │ duration_seconds (INT)       │ ──► Display Time
│  └──────────────────────────────┘
│
└─────────────────────────────────┐
│   OPTIONAL FIELDS               │
│  ┌──────────────────────────────┐
│  │ thumbnail_image (URL)        │ ──► List Display
│  │ cover_image (URL)            │ ──► Detail View
│  │ transcript_ar (TEXT)         │ ──► For Accessibility
│  │ is_published (BOOLEAN)       │ ──► Visibility
│  │ is_featured (BOOLEAN)        │ ──► Highlight
│  │ has_worksheets (BOOLEAN)     │ ──► Flag
│  │ sort_order (INT)             │ ──► Manual Order
│  │ published_at (TIMESTAMP)     │ ──► Publish Date
│  └──────────────────────────────┘
│
└─────────────────────────────────
```

---

## Error Handling Flow

```
CLIENT-SIDE VALIDATION
        ↓
    ✓ Valid ──→ Send to Server
    ✗ Invalid ─→ Display FormHelperText
        ↑
    User Fixes ──┘

SERVER-SIDE VALIDATION
        ↓
    ✓ Valid ──→ Process & Save
    ✗ Invalid ─→ Return 400 Error

Error Response Handling
        ↓
    ├─ Has errors object ──→ Extract first error message
    ├─ Has message field ──→ Display message
    └─ Generic error ──────→ Display default message

Display Error to User
        ↓
    openSnackbar({
      message: error message,
      color: 'error'
    })
        ↓
    Form remains open for correction
```

---

## Component Tree

```
Dashboard
├── Episodes List Page
│   ├── Header (Title)
│   ├── Filter Controls
│   ├── Episodes Table
│   │   └── Action Buttons (Edit, Delete, View)
│   └── Add Episode Button
│       └── Episode Creation Page
│           └── MainCard
│               └── EpisodeForm
│                   ├── TextField (title_ar)
│                   ├── Select (category_id)
│                   ├── TextField (episode_number)
│                   ├── TextArea (descriptions)
│                   ├── TextField (video_url)
│                   ├── Select (video_type)
│                   ├── TextField (duration_seconds)
│                   ├── TextField (images)
│                   ├── TextArea (transcript)
│                   ├── Checkbox (is_published)
│                   ├── Checkbox (is_featured)
│                   ├── Checkbox (has_worksheets)
│                   └── Buttons (Cancel, Save)
│
└── Categories Page
    ├── Header (Title)
    ├── Categories Table
    │   └── Action Buttons (Edit, Delete)
    └── Add Category Button
        └── CategoryForm Dialog
            ├── Select (type)
            ├── TextField (name_ar)
            ├── TextField (name_en)
            ├── TextArea (description_ar)
            ├── TextArea (description_en)
            ├── TextField (slug)
            ├── TextField (image)
            └── Buttons (Cancel, Save)
```

---

## State Management Flow

```
CreateEpisode Component
├── isLoading (boolean)
│   └── Controls button disabled state
│
└── handleSubmit(values)
    ├── setIsLoading(true)
    ├── createEpisode(values)
    │   └── API Call
    │       ├── Success
    │       │   ├── Show Success Snackbar
    │       │   ├── setTimeout 1.5s
    │       │   └── navigate('/dashboard/episodes')
    │       │
    │       └── Error
    │           └── Show Error Snackbar
    │               └── Keep form open
    │
    └── setIsLoading(false)

Form State (Formik)
├── values (object)
│   └── Form field values
│
├── errors (object)
│   └── Validation errors
│
├── touched (object)
│   └── Which fields user interacted with
│
└── handleSubmit
    └── Calls CreateEpisode.handleSubmit()
```

---

**Architecture designed for**: Scalability, RTL Support, Bilingual Content
**Status**: ✅ Ready for Implementation
