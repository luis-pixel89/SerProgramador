-- CreateTable
CREATE TABLE "Advisor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_name_key" ON "Advisor"("name");

-- Seed initial advisors (matching existing hardcoded options)
INSERT INTO "Advisor" ("id", "name") VALUES
  (gen_random_uuid()::text, 'Josselyn'),
  (gen_random_uuid()::text, 'Paul');
