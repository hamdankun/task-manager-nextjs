/*
  Warnings:

  - You are about to drop the column `projectId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_userId_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_projectId_fkey`;

-- DropIndex
DROP INDEX `tasks_projectId_idx` ON `tasks`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `projectId`,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'TODO';

-- DropTable
DROP TABLE `notifications`;

-- DropTable
DROP TABLE `projects`;
