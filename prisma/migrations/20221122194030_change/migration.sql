/*
  Warnings:

  - The primary key for the `board` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
ALTER TABLE `board` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `column` MODIFY `boardId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `task` MODIFY `boardId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Board` ADD CONSTRAINT `Board_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Column` ADD CONSTRAINT `Column_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_columnId_fkey` FOREIGN KEY (`columnId`) REFERENCES `Column`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubTask` ADD CONSTRAINT `SubTask_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;