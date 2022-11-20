/*
  Warnings:

  - Made the column `boardId` on table `column` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Board_userId_fkey` ON `board`;

-- DropIndex
DROP INDEX `Column_boardId_fkey` ON `column`;

-- DropIndex
DROP INDEX `SubTask_taskId_fkey` ON `subtask`;

-- DropIndex
DROP INDEX `Task_boardId_fkey` ON `task`;

-- DropIndex
DROP INDEX `Task_columnId_fkey` ON `task`;

-- AlterTable
ALTER TABLE `column` MODIFY `boardId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Board` ADD CONSTRAINT `Board_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Column` ADD CONSTRAINT `Column_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_columnId_fkey` FOREIGN KEY (`columnId`) REFERENCES `Column`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubTask` ADD CONSTRAINT `SubTask_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
