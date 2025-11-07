-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Full-Time',
    "experienceLevel" TEXT NOT NULL DEFAULT 'Mid-Level',
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "salary" TEXT,
    "posted" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "applicationsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "postedById" TEXT,
    CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "linkedin" TEXT,
    "portfolio" TEXT,
    "location" TEXT,
    "resumeFilename" TEXT,
    "resumePath" TEXT,
    "resumeSize" INTEGER,
    "coverLetter" TEXT,
    "aiScoreOverall" INTEGER,
    "aiScoreSkillMatch" INTEGER,
    "aiScoreExperienceMatch" INTEGER,
    "aiScoreEducationMatch" INTEGER,
    "aiAnalysis" TEXT,
    "aiRecommendations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "jobId" INTEGER NOT NULL,
    "reviewedById" TEXT,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "seoDescription" TEXT,
    "aiGeneratedSummary" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "featuredImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "readTime" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "company" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "repliedAt" DATETIME,
    "aiResponse" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "assignedToId" TEXT,
    CONSTRAINT "Contact_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "aiGeneratedSummary" TEXT,
    "client" TEXT,
    "industry" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    "images" TEXT,
    "thumbnailImage" TEXT,
    "demoUrl" TEXT,
    "githubUrl" TEXT,
    "duration" TEXT,
    "teamSize" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "testimonialId" INTEGER,
    CONSTRAINT "Project_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientName" TEXT NOT NULL,
    "clientPosition" TEXT NOT NULL,
    "clientCompany" TEXT NOT NULL,
    "clientImage" TEXT,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "aiRephrased" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "content" TEXT,
    "items" TEXT,
    "images" TEXT,
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiPrompt" TEXT,
    "lastGeneratedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "updatedById" TEXT,
    CONSTRAINT "SiteContent_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "pageData" TEXT,
    "sources" TEXT,
    "devicesDesktop" INTEGER NOT NULL DEFAULT 0,
    "devicesMobile" INTEGER NOT NULL DEFAULT 0,
    "devicesTablet" INTEGER NOT NULL DEFAULT 0,
    "browsers" TEXT,
    "topCountries" TEXT,
    "conversionsContactForms" INTEGER NOT NULL DEFAULT 0,
    "conversionsJobApplications" INTEGER NOT NULL DEFAULT 0,
    "conversionsChatInteractions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Application_jobId_email_idx" ON "Application"("jobId", "email");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_testimonialId_key" ON "Project"("testimonialId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_section_key" ON "SiteContent"("section");

-- CreateIndex
CREATE INDEX "Analytics_date_idx" ON "Analytics"("date");
