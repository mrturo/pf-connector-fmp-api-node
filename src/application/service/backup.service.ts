import * as fs from 'fs-extra';
import { Constants as ConstantsUtil } from '../../domain/util/constants.util';
import { DateUtil } from '../../domain/util/date.util';
import { Logger as LoggerUtil } from '../../domain/util/logger.util';
export class Backup {
  public static maxDays = 1;
  public static fileExtension = '.json';
  public static async CreateFolderBase(): Promise<void> {
    await fs.ensureDir(ConstantsUtil.BACKUP_BASE_PATH());
  }
  public static async CleanOldData(): Promise<void> {
    fs.readdir(ConstantsUtil.BACKUP_BASE_PATH(), (err, files) => {
      files.forEach((file: string) => {
        try {
          const path = `${ConstantsUtil.BACKUP_BASE_PATH()}\\${file}`;
          if (file.trim().toLowerCase().startsWith('test') === true) {
            fs.unlinkSync(path);
          } else {
            const bodyFile = JSON.parse(fs.readFileSync(path, 'utf8'));
            if (!bodyFile || !bodyFile.date || !bodyFile.body) {
              fs.unlinkSync(path);
            } else {
              let date = new Date(bodyFile.date);
              date.setDate(date.getDate() + Backup.maxDays);
              date = DateUtil.CleanHour(date);
              const today = DateUtil.Today();
              if (today.getTime() >= date.getTime()) {
                fs.unlinkSync(path);
              }
            }
          }
        } catch (error) {
          let errorMsg = 'Server error';
          if (error instanceof Error) {
            errorMsg = error.message.trim();
            errorMsg =
              error.stack && error.stack.trim() !== ''
                ? error.stack.trim()
                : errorMsg;
          }
          LoggerUtil.warn(`Deleting file ${file}: ${errorMsg}`);
        }
      });
    });
  }
  public static async CleanAllData(): Promise<void> {
    fs.readdir(ConstantsUtil.BACKUP_BASE_PATH(), (err, files) => {
      files.forEach((file: string) => {
        try {
          const path = `${ConstantsUtil.BACKUP_BASE_PATH()}\\${file}`;
          fs.unlinkSync(path);
        } catch (error) {
          let errorMsg = 'Server error';
          if (error instanceof Error) {
            errorMsg = error.message.trim();
            errorMsg =
              error.stack && error.stack.trim() !== ''
                ? error.stack.trim()
                : errorMsg;
          }
          LoggerUtil.warn(`Deleting file ${file}: ${errorMsg}`);
        }
      });
    });
  }
}
