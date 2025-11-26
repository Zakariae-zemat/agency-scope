-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT,
    "stateCode" TEXT,
    "type" TEXT,
    "population" INTEGER,
    "website" TEXT,
    "totalSchools" INTEGER,
    "totalStudents" INTEGER,
    "mailingAddress" TEXT,
    "gradeSpan" TEXT,
    "locale" TEXT,
    "csaCbsa" TEXT,
    "domainName" TEXT,
    "physicalAddress" TEXT,
    "phone" TEXT,
    "status" TEXT,
    "studentTeacherRatio" DOUBLE PRECISION,
    "supervisoryUnion" TEXT,
    "county" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "emailType" TEXT,
    "contactFormUrl" TEXT,
    "department" TEXT,
    "agencyId" TEXT,
    "firmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_views" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "agencies_name_idx" ON "agencies"("name");

-- CreateIndex
CREATE INDEX "agencies_state_idx" ON "agencies"("state");

-- CreateIndex
CREATE INDEX "contacts_agencyId_idx" ON "contacts"("agencyId");

-- CreateIndex
CREATE INDEX "contacts_firstName_lastName_idx" ON "contacts"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "contacts_email_idx" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "contact_views_userId_viewedAt_idx" ON "contact_views"("userId", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "contact_views_userId_contactId_viewedAt_key" ON "contact_views"("userId", "contactId", "viewedAt");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_views" ADD CONSTRAINT "contact_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_views" ADD CONSTRAINT "contact_views_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
