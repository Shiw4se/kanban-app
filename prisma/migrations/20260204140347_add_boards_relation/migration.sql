/*
  Warnings:

  - You are about to drop the column `hashedId` on the `Board` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Board_hashedId_key";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "hashedId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" SET DEFAULT 'New Board';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'todo',
ALTER COLUMN "order" SET DEFAULT 0;
