import { db, admin } from './firebaseConfig';

/**
 * ユーザIDまたはメールアドレスからユーザ情報を取得する関数
 * @param identifier ユーザIDまたはメールアドレス
 * @returns ユーザ情報
 */
export async function getUserByIdOrEmail(identifier: string) {
  try {
    let userRecord;
    if (identifier.includes('@')) {
      // メールアドレスで検索
      userRecord = await admin.auth().getUserByEmail(identifier);
    } else {
      // ユーザIDで検索
      userRecord = await admin.auth().getUser(identifier);
    }
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(userRecord, null, 2)
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
