/*
  Warnings:

  - You are about to drop the column `description` on the `Lab` table. All the data in the column will be lost.
  - You are about to drop the column `labType` on the `Lab` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Lab` table. All the data in the column will be lost.
  - Added the required column `accessKey` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `app` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespaceName` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretKet` to the `Lab` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lab" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namespaceName" TEXT NOT NULL,
    "app" TEXT NOT NULL,
    "accessKey" TEXT NOT NULL,
    "secretKet" TEXT NOT NULL
);
INSERT INTO "new_Lab" ("id") SELECT "id" FROM "Lab";
DROP TABLE "Lab";
ALTER TABLE "new_Lab" RENAME TO "Lab";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
