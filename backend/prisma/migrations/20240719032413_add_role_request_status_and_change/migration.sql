-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "role_change_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "newRole" "Role" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_change_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "role_change_requests" ADD CONSTRAINT "role_change_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
