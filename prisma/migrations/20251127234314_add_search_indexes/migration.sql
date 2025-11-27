-- DropIndex
DROP INDEX "contacts_firstName_lastName_idx";

-- CreateIndex
CREATE INDEX "agencies_county_idx" ON "agencies"("county");

-- CreateIndex
CREATE INDEX "contacts_firstName_idx" ON "contacts"("firstName");

-- CreateIndex
CREATE INDEX "contacts_lastName_idx" ON "contacts"("lastName");

-- CreateIndex
CREATE INDEX "contacts_title_idx" ON "contacts"("title");

-- CreateIndex
CREATE INDEX "contacts_department_idx" ON "contacts"("department");
