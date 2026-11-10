-- CreateTable
CREATE TABLE "EmailConfiguration" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "provider" TEXT NOT NULL DEFAULT 'microsoft_graph',
    "tenantId" TEXT,
    "clientId" TEXT,
    "clientSecretEnc" TEXT,
    "senderEmail" TEXT NOT NULL DEFAULT 'advisory@milven.co.zw',
    "senderName" TEXT NOT NULL DEFAULT 'Milven Consulting',
    "recipients" JSONB NOT NULL DEFAULT '[]',
    "replyToBehaviour" TEXT NOT NULL DEFAULT 'visitor',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgementsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastSuccessAt" TIMESTAMP(3),
    "lastFailureAt" TIMESTAMP(3),
    "lastError" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "textBody" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailDeliveryLog" (
    "id" TEXT NOT NULL,
    "submissionRef" TEXT,
    "templateType" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailDeliveryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_type_key" ON "EmailTemplate"("type");
