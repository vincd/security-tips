from Crypto.Cipher import AES
import sqlite3


def decrypt_chrome_password(buff, master_key):
    cipher = AES.new(master_key, AES.MODE_GCM, buff[3:15])
    decrypted_pass = cipher.decrypt(buff[15:])[:-16]
    return decrypted_pass.decode('utf-8')

def read_password_from_db(db_path, master_key):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT action_url, username_value, password_value FROM logins')
    for url, login, password in cursor.fetchall():
        if url and login:
            password = decrypt_chrome_password(password, master_key)
            print(url, login, password)

if __name__ == '__main__':
    master_key = '0011..99'
    db_path = 'chrome_dir' + "\\Default\\Login Data"

    read_password_from_db(db_path, bytes.fromhex(master_key))
